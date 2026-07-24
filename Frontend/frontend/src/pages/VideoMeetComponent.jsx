import React, { useEffect, useRef, useState } from "react";
import TextField from "@mui/material/TextField";
import "../styles/videoComponent.css";
import Button from "@mui/material/Button";
import io from "socket.io-client";
// import "../styles/videoComponent.css";
// import Draggable from "react-draggable";
import { Rnd } from "react-rnd";

const server_url = "http://localhost:5000";
const connections = {};

const peerConfigConnections = {
  iceServers: [{ urls: "stun:stun1.l.google.com:19302" }],
};
export default function VideoMeetComponent() {
  const socketRef = useRef();
  const socketIdRef = useRef();
  const localVideoRef = useRef(null);

  const [videoAvailable, setVideoAvailable] = useState(true);
  const [audioAvailable, setAudioAvailable] = useState(true);

  const [video, setVideo] = useState();
  const [audio, setAudio] = useState();

  const [screen, setScreen] = useState();

  const [showModel, setShowModel] = useState();

  const [screenAvailable, setScreenAvailable] = useState();

  const [messages, setMessages] = useState([]);

  const [message, setMessage] = useState("");

  const [newMessages, setNewMessages] = useState(0);

  const [askForUsername, setAskForUsername] = useState(true);

  const [username, setUsername] = useState("");

  const videoRef = useRef([]);

  const [videos, setVideos] = useState([]);

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
        audio: true,
        video: true,
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
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }

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
        .getUserMedia({ audio: audio, video: video })
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
  }, [audio, video]);

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
      socketRef.current.emit("join-call", {
        path: window.location.href,
        username,
      });

      socketIdRef.current = socketRef.current.id;

      socketRef.current.on("chat-msg", addMsg);

      socketRef.current.on("user-left", (id) => {
        setVideos((video) => video.filter((video) => video.socketId !== id));
      });

      socketRef.current.on("user-joined", ({ id, clients }) => {
        clients.forEach((client) => {
          connections[client.socketId] = new RTCPeerConnection(
            peerConfigConnections,
          );

          connections[client.socketId].onicecandidate = (event) => {
            if (event.candidate !== null) {
              socketRef.current.emit(
                "signal",
                client.socketId,
                JSON.stringify({ ice: event.candidate }),
              );
            }
          };

          connections[client.socketId].onaddstream = (event) => {
            const videoExists = videoRef.current.find(
              (video) => video.socketId === client.socketId,
            );

            if (videoExists) {
              setVideos((videos) => {
                {
                  const updateVideos = videos.map((video) =>
                    video.socketId === client.socketId
                      ? { ...video, stream: event.stream }
                      : video,
                  );

                  videoRef.current = updateVideos;
                  return updateVideos;
                }
              });
            } else {
              const newVideo = {
                socketId: client.socketId,
                username: client.username,
                stream: event.stream,
                autoPlay: true,
                playsinline: true,
              };

              // setVideo((video) => {
              //   const updateVideos = [...video, newVideo];
              //   videoRef.current = updateVideos;
              //   return updateVideos;
              // });

              setVideos((prevVideos) => {
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
            connections[client.socketId].addStream(window.localStream);
          } else {
            let blackSilence = (...args) =>
              new MediaStream([black(...args), silence()]);
            window.localStream = blackSilence();
            connections[client.socketId].addStream(window.localStream);
          }

          if (id === socketIdRef.current) {
            for (let id2 in connections) {
              if (id2 === socketIdRef.current) {
                continue;
              }
              if (
                id === socketIdRef.current &&
                client.socketId !== socketIdRef.current
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
    setAskForUsername(false);
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
        <div className="relative min-h-screen bg-gradient-to-br from-black via-gray-950 to-purple-950 text-white relative overflow-hidden">
          {/* Videos Grid */}
          <div className="flex flex-wrap justify-start gap-6 p-8">
            {/* Remote Users */}
            {videos?.map((video) => (
              <div
                key={video.socketId}
                className="relative w-[320px] h-[220px] rounded-2xl overflow-hidden
                   bg-black/50 border border-purple-500/40
                   shadow-[0_0_30px_rgba(168,85,247,0.25)]
                   backdrop-blur-md"
              >
                <video
                  data-socket={video.socketId}
                  ref={(ref) => {
                    if (ref && video.stream) {
                      ref.srcObject = video.stream;
                    }
                  }}
                  autoPlay
                  className="w-full h-full object-cover"
                />

                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/60 text-sm">
                  {video.username}
                </div>
              </div>
            ))}
          </div>

          {/* Local Video (Top Right) - Draggable */}
          <Rnd
            default={{
              x: window.innerWidth - 340,
              y: 20,
              width: 300,
              height: 180,
            }}
            bounds="window"
            minWidth={220}
            minHeight={140}
            style={{ zIndex: 50 }}
            className="rounded-2xl overflow-hidden border-2 border-purple-500 bg-black shadow-[0_0_35px_rgba(168,85,247,0.5)] cursor-move"
          >
            <video
              ref={localVideoRef}
              autoPlay
              muted
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 px-3 py-1 rounded-full bg-purple-600 text-sm text-white">
              You
            </div>
          </Rnd>

          {/* Bottom Controls */}
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2">
            <div className="flex items-center gap-5 bg-black/60 backdrop-blur-xl border border-purple-500/30 rounded-full px-8 py-4 shadow-2xl">
              <button className="w-14 h-14 rounded-full bg-gray-800 hover:bg-purple-700 transition-all duration-300 flex items-center justify-center text-xl">
                🎤
              </button>

              <button className="w-14 h-14 rounded-full bg-gray-800 hover:bg-purple-700 transition-all duration-300 flex items-center justify-center text-xl">
                📹
              </button>

              <button className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 transition-all duration-300 flex items-center justify-center text-2xl shadow-lg">
                📞
              </button>

              <button className="w-14 h-14 rounded-full bg-gray-800 hover:bg-purple-700 transition-all duration-300 flex items-center justify-center text-xl">
                💬
              </button>

              <button className="w-14 h-14 rounded-full bg-gray-800 hover:bg-purple-700 transition-all duration-300 flex items-center justify-center text-xl">
                ⚙️
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
