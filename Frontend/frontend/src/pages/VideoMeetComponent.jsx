import React, { useEffect, useRef, useState } from "react";
import TextField from "@mui/material/TextField";
import "../styles/videoComponent.css";
import Button from "@mui/material/Button";
import io from "socket.io-client";

const server_url = "http://localhost:5000";
const connections = {};

const peerConfigConnections = {
  iceServers: [{ urls: "stun:stun1.l.google.com:19302" }],
};
export default function VideoMeetComponent() {
  let socketRef = useRef();
  let socketIdRef = useRef();
  let localVideoRef = useRef(null);

  let [videoAvailable, setVideoAvailable] = useState(true);
  let [audioAvailable, setAudioAvailable] = useState(true);

  const [video, setVideo] = useState([]);
  const [audio, setAudio] = useState();

  let [screen, setScreen] = useState();

  let [showModel, setShowModel] = useState();

  let [screenAvailable, setScreenAvailable] = useState();

  let [messages, setMessages] = useState([]);

  let [message, setMessage] = useState("");

  let [newMessages, setNewMessages] = useState(0);

  let [askForUsername, setAskForUsername] = useState(true);

  let [username, setUsername] = useState("");

  const videoRef = useRef([]);

  let [videos, setVideos] = useState([]);

  const getPermissions = async () => {
    try {
      if (typeof navigator.mediaDevices.getDisplayMedia === "function") {
        setScreenAvailable(true);
      } else {
        setScreenAvailable(
          typeof navigator.mediaDevices.getDisplayMedia === "function",
        );
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      let hasVideo = stream.getVideoTracks().length > 0;
      let hasAudio = stream.getAudioTracks().length > 0;

      setVideoAvailable(hasVideo);
      setAudioAvailable(hasAudio);

      window.localStream = stream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.log(error);
      setVideoAvailable(false);
      setAudioAvailable(false);
      if (typeof navigator.mediaDevices.getDisplayMedia === "function") {
        setScreenAvailable(true);
      } else {
        setScreenAvailable(
          typeof navigator.mediaDevices.getDisplayMedia === "function",
        );
      }
    }
  };

  useEffect(() => {
    getPermissions();
  }, []);

  let getUserMediaSuccess = (stream) => {
    try {
      window.localStream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      console.log(error);
    }

    window.localStream = stream;
    localVideoRef.current.srcObject = stream;

    for (const id in connections) {
      if (id === socketIdRef.current) {
        continue;
      }
      if (!connections[id].getLocalStreams().length) {
        connections[id].addStream(window.localStream);
      }
      // connections[id]
      //   .createOffer()
      //   .then((description) => {
      //     connections[id].setLocalDescription(description).then(() => {
      //       socketRef.current.emit(
      //         "signal",
      //         id,
      //         JSON.stringify({ sdp: connections[id].localDescription }),
      //       );
      //     });
      //   })
      //   .catch((e) => console.log(e));

      stream.getTracks().forEach(
        (track) =>
          (track.onended = () => {
            setVideo(false);
            setAudio(false);

            try {
              let tracks = localVideoRef.current.srcObject.getTracks();
              tracks.forEach((track) => track.stop());
            } catch (error) {
              console.log(error);
            }

            let blackSilence = (...args) =>
              new MediaStream([black(...args), silence()]);
            window.localStream = blackSilence();
            localVideoRef.current.srcObject = window.localStream;

            for (const id in connections) {
              if (id === socketIdRef.current) {
                continue;
              }
              if (connections[id].getLocalStreams().length === 0) {
                connections[id].addStream(window.localStream);
              }
              // connections[id]
              //   .createOffer()
              //   .then((description) => {
              //     connections[id].setLocalDescription(description).then(() => {
              //       socketRef.current.emit(
              //         "signal",
              //         id,
              //         JSON.stringify({ sdp: connections[id].localDescription }),
              //       );
              //     });
              //   })
              //   .catch((e) => console.log(e));
            }
          }),
      );
    }
  };

  const silence = () => {
    let ctx = new AudioContext();
    let oscillator = ctx.createOscillator();
    let dst = oscillator.connect(ctx.createMediaStreamDestination());

    oscillator.start();
    ctx.resume();
    return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
  };

  const black = ({ width = 640, height = 480 } = {}) => {
    const canvas = Object.assign(document.createElement("canvas"), {
      width,
      height,
    });

    canvas.getContext("2d").fillRect(0, 0, width, height);
    let stream = canvas.captureStream();
    return Object.assign(stream.getVideoTracks()[0], { enabled: false });
  };

  let getUserMedia = () => {
    if ((video && videoAvailable) || (audio && audioAvailable)) {
      navigator.mediaDevices
        .getUserMedia({ video: video, audio: audio })
        .then(getUserMediaSuccess)
        .then((stream) => {})
        .catch((e) => {
          console.log(e);
        });
    } else {
      try {
        let tracks = localVideoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      } catch (error) {}
    }
  };

  useEffect(() => {
    if (video !== undefined && audio !== undefined) {
      getUserMedia();
    }
  }, [video, audio]);

  function renegotiate(id) {
    const pc = connections[id];

    if (pc.signalingState !== "stable") {
      console.log("Skip renegotiation:", pc.signalingState);
      return;
    }

    pc.createOffer()
      .then((offer) => pc.setLocalDescription(offer))
      .then(() => {
        socketRef.current.emit(
          "signal",
          id,
          JSON.stringify({
            sdp: pc.localDescription,
          }),
        );
      })
      .catch(console.error);
  }

  let gotMessagesFromServer = (fromId, message) => {
    const signal = JSON.parse(message);
    if (fromId !== socketIdRef.current) {
      if (signal.sdp) {
        connections[fromId]
          .setRemoteDescription(new RTCSessionDescription(signal.sdp))
          .then(() => {
            if (signal.sdp.type === "offer") {
              connections[fromId]
                .createAnswer()
                .then((description) => {
                  return connections[fromId].setLocalDescription(description);
                })
                .then(() => {
                  socketRef.current.emit(
                    "signal",
                    fromId,
                    JSON.stringify({
                      sdp: connections[fromId].localDescription,
                    }),
                  );
                })
                .catch((e) => console.log(e));
            }
          })
          .catch((e) => console.log(e));
      }

      if (signal.ice) {
        connections[fromId]
          .addIceCandidate(new RTCIceCandidate(signal.ice))
          .catch((e) => console.log(e));
      }
    }
  };

  let addMsg = (data, sender) => {};

  let connectToSocketServer = () => {
    socketRef.current = io.connect(server_url);

    socketRef.current.on("signal", gotMessagesFromServer);

    socketRef.current.on("connect", () => {
      // console.log(socketRef.current.id);
      socketRef.current.emit("join-call", window.location.href);

      socketIdRef.current = socketRef.current.id;

      socketRef.current.on("chat-msg", addMsg);

      socketRef.current.on("user-left", (id) => {
        setVideo((video) => video.filter((video) => video.socketId !== id));
      });

      socketRef.current.on("user-joined", (id, clients) => {
        clients.forEach((socketListId) => {
          connections[socketListId] = new RTCPeerConnection(
            peerConfigConnections,
          );

          connections[socketListId].onicecandidate = (event) => {
            if (event.candidate !== null) {
              socketRef.current.emit(
                "signal",
                socketListId,
                JSON.stringify({ ice: event.candidate }),
              );
            }
          };

          connections[socketListId].onaddstream = (event) => {
            const videoExists = videoRef.current.find(
              (video) => video.socketId === socketListId,
            );

            if (videoExists) {
              setVideo((videos) => {
                {
                  const updateVideos = videos.map((video) =>
                    video.socketId === socketListId
                      ? { ...video, stream: event.stream }
                      : video,
                  );

                  videoRef.current = updateVideos;
                  return updateVideos;
                }
              });
            } else {
              const newVideo = {
                socketId: socketListId,
                stream: event.stream,
                autoPlay: true,
                playsinline: true,
              };

              // setVideo((video) => {
              //   const updateVideos = [...video, newVideo];
              //   videoRef.current = updateVideos;
              //   return updateVideos;
              // });

              setVideo((prevVideos) => {
                // Ensure prevVideos is an array before spreading; fallback to empty array if not
                const currentVideos = Array.isArray(prevVideos)
                  ? prevVideos
                  : [];
                const updatedVideos = [...currentVideos, newVideo];
                videoRef.current = updatedVideos;
                return updatedVideos;
              });
            }
          };

          if (window.localStream !== undefined && window.localStream !== null) {
            connections[socketListId].addStream(window.localStream);
          } else {
            let blackSilence = (...args) =>
              new MediaStream([black(...args), silence()]);
            window.localStream = blackSilence();
            connections[socketListId].addStream(window.localStream);
          }

          if (id === socketIdRef.current) {
            for (let id2 in connections) {
              if (id2 === socketIdRef.current) {
                continue;
              }
              if (
                id === socketIdRef.current &&
                socketListId !== socketIdRef.current
              ) {
                renegotiate(id2); //this is for create offer
              }
              // connections[id2].createOffer().then((description) => {
              //   connections[id2]
              //     .setLocalDescription(description)
              //     .then(() => {
              //       socketRef.current.emit(
              //         "signal",
              //         id2,
              //         JSON.stringify({
              //           sdp: connections[id2].localDescription,
              //         }),
              //       );
              //     })
              //     .catch((e) => console.log(e));
              // });
            }
          }
        });
      });
    });
  };

  let getMedia = () => {
    setVideo(videoAvailable);
    setAudio(audioAvailable);
    setUsername("");
    connectToSocketServer();
  };

  return (
    <div>
      {askForUsername === true ? (
        <div>
          <h1>Enter into Lobby</h1>
          <br />
          <TextField
            id="outlined-basic"
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <br />
          <br />
          <Button variant="contained" onClick={getMedia}>
            Connect
          </Button>

          <div>
            <video ref={localVideoRef} autoPlay muted></video>
          </div>
        </div>
      ) : (
        <>
          <video ref={localVideoRef} autoPlay muted></video>
          {videos.map((video) => {
            <div key={video.socketId}></div>;
          })}
        </>
      )}
    </div>
  );
}
