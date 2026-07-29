import React, { useEffect, useRef, useState } from "react";
import TextField from "@mui/material/TextField";
import "../styles/videoComponent.css";
import Button from "@mui/material/Button";
import io from "socket.io-client";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Settings,
  MonitorUp,
  MonitorOff,
  MessageCircle,
  Send,
  X,
  User,
  ArrowRight,
} from "lucide-react";

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

  const [screen, setScreen] = useState(false);

  const [showModel, setShowModel] = useState(false);

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
      if (id === socketIdRef.current) continue;
      const streams = connections[id].getLocalStreams();
      if (streams.length > 0) {
        connections[id].removeStream(streams[0]);
      }
      connections[id].addStream(window.localStream);
      renegotiate(id);

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
                renegotiate(id);
              }
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

  let addMsg = (data, sender, socketIdSender) => {
    setMessages((prevMsgs) => [...prevMsgs, { sender, data, socketIdSender }]);
    if (showModel === false && socketIdSender !== socketIdRef.current) {
      setNewMessages((prevMsgs) => prevMsgs + 1);
    }
  };

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
    connectToSocketServer();
  };

  const toggleMic = () => {
    if (window.localStream) {
      window.localStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
    }
    setAudio((prev) => !prev);
  };

  const toggleVideo = () => {
    if (window.localStream) {
      window.localStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
    }
    setVideo((prev) => !prev);
  };

  const leaveCall = () => {
    if (window.localStream) {
      window.localStream.getTracks().forEach((track) => track.stop());
    }
    socketRef.current.disconnect();
    window.location.href = "/";
  };

  const getDisplayMediaSuccess = (stream) => {
    window.localStream.getTracks().forEach((track) => track.stop());
    window.localStream = stream;
    localVideoRef.current.srcObject = stream;

    for (const id in connections) {
      if (id === socketIdRef.current) {
        continue;
      }
      const streams = connections[id].getLocalStreams();
      if (streams.length > 0) {
        connections[id].removeStream(streams[0]);
      }
      connections[id].addStream(stream);
      renegotiate(id);
    }

    stream.getVideoTracks()[0].onended = () => {
      setScreen(false);
      getUserMedia();
    };
  };

  const toggleScreenShare = async () => {
    if (!screen) {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });

        getDisplayMediaSuccess(stream);
        setScreen(true);
      } catch (error) {
        console.log(error);
      }
    } else {
      getUserMedia();
      setScreen(false);
    }
  };

  const sendMessage = () => {
    if (!message.trim()) return;
    socketRef.current.emit("chat-msg", message, username);
    setMessage("");
  };

  const handleBadge = () => {
    setShowModel((prev) => !prev);
    setNewMessages(0);
  };

  const chatBodyRef = useRef(null);

  useEffect(() => {
    chatBodyRef.current?.scrollTo({
      top: chatBodyRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div>
      {askForUsername === true ? (
        <div className="min-h-screen bg-linear-to-br from-[#09090B] via-[#111827] to-[#1A1038] flex items-center justify-center px-5 selection:bg-purple-600 selection:text-white">
          {/* Background Glow */}
          <div className="absolute w-96 h-96 bg-purple-700/20 blur-[140px] rounded-full top-0 left-0"></div>
          <div className="absolute w-96 h-96 bg-fuchsia-700/20 blur-[140px] rounded-full bottom-0 right-0"></div>

          <div className="relative z-10 w-full max-w-5xl grid lg:grid-cols-2 gap-10 items-center">
            {/* Left Side */}
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300">
                <Video size={18} />
                HaloMeet Lobby
              </span>

              <h1 className="mt-6 text-5xl font-bold text-white leading-tight">
                Join Your
                <span className="text-purple-500"> Meeting</span>
              </h1>

              <p className="mt-5 text-gray-400 text-lg leading-8">
                Enter your username to join the meeting instantly. Connect with
                your team through secure HD video, real-time chat and seamless
                collaboration.
              </p>
            </div>

            {/* Right Card */}

            <div className="rounded-3xl border border-purple-500/20 bg-[#16131F]/90 backdrop-blur-xl p-8 shadow-[0_0_60px_rgba(124,58,237,.2)]">
              <h2 className="text-3xl font-bold text-white">Enter Lobby</h2>

              <p className="mt-2 text-gray-400">
                Fill in your username to continue.
              </p>

              {/* Username */}

              <div className="mt-8">
                <label className="text-gray-300 mb-2 block">Username</label>

                <div className="flex items-center rounded-xl bg-[#23212d] border border-purple-500/20 px-4">
                  <User className="text-purple-400" size={20} />

                  <input
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-transparent px-4 py-4 text-white outline-none placeholder:text-gray-500"
                  />
                </div>
              </div>

              {/* Button */}

              <button
                onClick={getMedia}
                className="mt-8 w-full rounded-xl bg-purple-600 hover:bg-purple-700 transition py-4 text-lg font-semibold text-white flex items-center justify-center gap-2"
              >
                Join Meeting
                <ArrowRight size={20} />
              </button>

              {/* Preview */}

              <div className="mt-8">
                <p className="text-gray-400 mb-3">Camera Preview</p>

                <div className="overflow-hidden rounded-2xl border border-purple-500/20 bg-black aspect-video">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative min-h-screen bg-linear-to-br from-black via-gray-950 to-purple-950 text-white overflow-hidden">
          {/* Videos Grid */}
          <div className="flex flex-wrap justify-start gap-6 p-8">
            {/* Remote Users */}
            {videos?.map((video) => (
              <div
                key={video.socketId}
                className="relative w-[320px] h-55 rounded-2xl overflow-hidden
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

          {showModel && (
            <div className="fixed top-0 right-0 h-screen w-90 bg-[#16131f]/95 backdrop-blur-xl border-l border-purple-500/30 shadow-2xl z-50 flex  flex-col">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-purple-500/20">
                <h2 className="text-xl font-semibold text-white">
                  Meeting Chat
                </h2>

                <button
                  onClick={() => setShowModel(false)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  <X size={22} className="text-gray-300 hover:text-white" />
                </button>
              </div>

              {/* Messages */}
              <div
                className="flex-1 overflow-y-auto p-4 space-y-4 h-full flex-col"
                ref={chatBodyRef}
              >
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.socketIdSender === socketIdRef.current
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                        msg.socketIdSender === socketIdRef.current
                          ? "bg-purple-600 text-white"
                          : "bg-gray-800 text-gray-100"
                      }`}
                    >
                      <p className="text-xs text-purple-300 mb-1 font-semibold">
                        {msg.socketIdSender === socketIdRef.current
                          ? "You"
                          : msg.sender}
                      </p>

                      <p>{msg.data}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="border-t border-purple-500/20 p-4">
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        sendMessage();
                      }
                    }}
                    className="flex-1 bg-gray-900 border border-purple-500/20 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500"
                  />

                  <button
                    onClick={sendMessage}
                    className="bg-purple-600 hover:bg-purple-700 rounded-xl px-5 text-white font-medium"
                  >
                    <Send size={20} className="text-white" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Controls */}
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2">
            <div className="flex items-center gap-5 bg-black/60 backdrop-blur-xl border border-purple-500/30 rounded-full px-8 py-4 shadow-2xl">
              {/* Mic */}
              <button
                onClick={toggleMic}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition
      ${
        audio
          ? "bg-gray-800 hover:bg-purple-700"
          : "bg-red-600 hover:bg-red-700"
      }`}
              >
                {audio ? <Mic size={24} /> : <MicOff size={24} />}
              </button>

              {/* Camera */}
              <button
                onClick={toggleVideo}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition
      ${
        video
          ? "bg-gray-800 hover:bg-purple-700"
          : "bg-red-600 hover:bg-red-700"
      }`}
              >
                {video ? <Video size={24} /> : <VideoOff size={24} />}
              </button>

              {/* Leave */}
              <button
                onClick={leaveCall}
                className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center shadow-lg transition"
              >
                <PhoneOff size={28} />
              </button>

              {/* Chat */}
              <button
                onClick={handleBadge}
                className={`relative w-14 h-14 rounded-full bg-gray-800 hover:bg-purple-700 transition flex items-center justify-center ${
                  showModel
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-800 hover:bg-purple-700"
                }`}
              >
                <MessageCircle size={24} />

                {newMessages > 0 && showModel === false && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center">
                    {newMessages}
                  </span>
                )}
              </button>

              {/* Settings */}
              {/* <button className="w-14 h-14 rounded-full bg-gray-800 hover:bg-purple-700 flex items-center justify-center transition">
                <Settings size={24} />
              </button> */}

              {/* {Screen Sharing button} */}
              <button
                onClick={toggleScreenShare}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition
  ${
    screen
      ? "bg-green-600 hover:bg-green-700"
      : "bg-gray-800 hover:bg-purple-700"
  }`}
              >
                {screen ? <MonitorOff size={24} /> : <MonitorUp size={24} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
