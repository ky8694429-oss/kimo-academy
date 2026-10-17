const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// تشغيل الـ HTML المدمج مباشرة من نفس الملف
app.get('/', (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Instagram x Omegle Ultra</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script src="https://cdn.socket.io/4.7.5/socket.io.min.js"></script>
    <style>
        :root {
            --ig-bg: #000000; --ig-card-bg: #121212; --ig-input-bg: #262626;
            --ig-border: #262626; --ig-text: #f5f5f5; --ig-text-secondary: #a8a8a8;
            --ig-gradient: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
            --ig-btn-primary: #0095f6; --ig-danger: #ed4956;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        body { background-color: var(--ig-bg); color: var(--ig-text); height: 100vh; display: flex; flex-direction: column; overflow: hidden; }
        .navbar { height: 60px; background-color: var(--ig-bg); border-bottom: 1px solid var(--ig-border); display: flex; justify-content: space-between; align-items: center; padding: 0 20px; z-index: 10; }
        .logo { font-size: 22px; font-weight: 800; background: var(--ig-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; display: flex; align-items: center; gap: 8px; }
        .online-status { background: var(--ig-card-bg); border: 1px solid var(--ig-border); padding: 6px 14px; border-radius: 20px; font-size: 13px; color: var(--ig-text-secondary); display: flex; align-items: center; gap: 8px; }
        .pulse-dot { width: 8px; height: 8px; background-color: #10b981; border-radius: 50%; box-shadow: 0 0 8px #10b981; animation: pulse 1.5s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.85); } }
        .main-container { flex: 1; display: flex; gap: 15px; padding: 15px; height: calc(100vh - 60px); }
        .video-section { flex: 2.5; display: flex; flex-direction: column; gap: 15px; }
        .video-box { flex: 1; background-color: var(--ig-card-bg); border: 1px solid var(--ig-border); border-radius: 16px; position: relative; overflow: hidden; display: flex; justify-content: center; align-items: center; }
        video { width: 100%; height: 100%; object-fit: cover; }
        .video-overlay { position: absolute; top: 12px; right: 12px; left: 12px; display: flex; justify-content: space-between; align-items: center; pointer-events: none; }
        .user-tag { background: rgba(0, 0, 0, 0.65); backdrop-filter: blur(8px); padding: 6px 12px; border-radius: 20px; font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 6px; border: 1px solid rgba(255, 255, 255, 0.1); }
        .user-tag.instagram-style { border-right: 3px solid #e6683c; }
        .controls-group { display: flex; gap: 8px; pointer-events: auto; }
        .icon-btn { background: rgba(38, 38, 38, 0.8); backdrop-filter: blur(8px); border: 1px solid rgba(255, 255, 255, 0.1); color: var(--ig-text); width: 38px; height: 38px; border-radius: 50%; cursor: pointer; display: flex; justify-content: center; align-items: center; transition: 0.2s; }
        .icon-btn:hover { background: var(--ig-gradient); }
        .icon-btn.active-off { background: var(--ig-danger); }
        .placeholder-box { position: absolute; text-align: center; color: var(--ig-text-secondary); }
        .placeholder-box i { font-size: 40px; background: var(--ig-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 12px; }
        .chat-section { flex: 1.2; background-color: var(--ig-card-bg); border: 1px solid var(--ig-border); border-radius: 16px; display: flex; flex-direction: column; overflow: hidden; }
        .chat-header { padding: 15px; border-bottom: 1px solid var(--ig-border); display: flex; justify-content: space-between; align-items: center; }
        .chat-header h3 { font-size: 16px; font-weight: 700; display: flex; align-items: center; gap: 8px; }
        .typing-status { font-size: 12px; color: #f59e0b; }
        .chat-messages { flex: 1; padding: 15px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; }
        .msg { max-width: 75%; padding: 10px 16px; border-radius: 20px; font-size: 14px; line-height: 1.4; word-break: break-word; background-color: var(--ig-input-bg); color: var(--ig-text); align-self: flex-start; }
        .msg.me { background: var(--ig-gradient); color: #ffffff; align-self: flex-end; border-bottom-left-radius: 20px; border-bottom-right-radius: 4px; }
        .msg.sys { background: transparent; color: var(--ig-text-secondary); align-self: center; font-size: 12px; text-align: center; }
        .chat-input-wrapper { padding: 12px; border-top: 1px solid var(--ig-border); display: flex; gap: 8px; align-items: center; }
        .chat-input-wrapper input { flex: 1; background-color: var(--ig-input-bg); border: 1px solid var(--ig-border); border-radius: 24px; padding: 12px 18px; color: var(--ig-text); font-size: 14px; outline: none; }
        .send-btn { background: none; border: none; color: var(--ig-btn-primary); font-weight: 700; font-size: 15px; cursor: pointer; padding: 0 8px; }
        .send-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .action-btn-container { padding: 12px; background: var(--ig-card-bg); }
        .btn-gradient { width: 100%; background: var(--ig-gradient); border: none; padding: 14px; border-radius: 12px; color: #fff; font-weight: 700; font-size: 16px; cursor: pointer; display: flex; justify-content: center; align-items: center; gap: 8px; transition: 0.2s; }
        .btn-gradient:hover { opacity: 0.95; transform: translateY(-2px); }
        .hidden { display: none !important; }
        @media (max-width: 850px) {
            .main-container { flex-direction: column; height: auto; overflow-y: auto; }
            .video-section { height: 450px; flex: none; }
            .chat-section { height: 380px; flex: none; }
        }
    </style>
</head>
<body>
    <header class="navbar">
        <div class="logo"><i class="fa-brands fa-instagram"></i> <span>OMEGLE DIRECT</span></div>
        <div class="online-status"><span class="pulse-dot"></span><span>المتصلون: <strong id="onlineCount">1</strong></span></div>
    </header>
    <main class="main-container">
        <section class="video-section">
            <div class="video-box">
                <video id="remoteVideo" autoplay playsinline></video>
                <div class="video-overlay"><span class="user-tag"><i class="fa-solid fa-user"></i> الطرف الآخر</span></div>
                <div id="placeholder" class="placeholder-box">
                    <i class="fa-solid fa-spinner fa-spin"></i>
                    <p id="statusText">اضغط "بدء المحادثة" للتوصيل بشخص عشوائي</p>
                </div>
            </div>
            <div class="video-box">
                <video id="localVideo" autoplay playsinline muted></video>
                <div class="video-overlay">
                    <span class="user-tag instagram-style"><i class="fa-solid fa-circle-user"></i> أنت</span>
                    <div class="controls-group">
                        <button id="toggleMic" class="icon-btn"><i class="fa-solid fa-microphone"></i></button>
                        <button id="toggleCam" class="icon-btn"><i class="fa-solid fa-video"></i></button>
                        <button id="flipCam" class="icon-btn"><i class="fa-solid fa-camera-rotate"></i></button>
                    </div>
                </div>
            </div>
        </section>
        <section class="chat-section">
            <div class="chat-header">
                <h3><i class="fa-regular fa-paper-plane"></i> الشات المباشر</h3>
                <span id="typingIndicator" class="typing-status hidden">يكتب الآن...</span>
            </div>
            <div id="chatBox" class="chat-messages"></div>
            <div class="chat-input-wrapper">
                <input type="text" id="msgInput" placeholder="اكتب رسالتك هنا..." disabled>
                <button id="sendBtn" class="send-btn" disabled>إرسال</button>
            </div>
            <div class="action-btn-container">
                <button id="nextBtn" class="btn-gradient"><i class="fa-solid fa-forward"></i> بدء المحادثة / التالي</button>
            </div>
        </section>
    </main>
    <script>
        const socket = io();
        const localVideo = document.getElementById('localVideo');
        const remoteVideo = document.getElementById('remoteVideo');
        const statusText = document.getElementById('statusText');
        const placeholder = document.getElementById('placeholder');
        const chatBox = document.getElementById('chatBox');
        const msgInput = document.getElementById('msgInput');
        const sendBtn = document.getElementById('sendBtn');
        const nextBtn = document.getElementById('nextBtn');
        const onlineCount = document.getElementById('onlineCount');
        const typingIndicator = document.getElementById('typingIndicator');
        const toggleMicBtn = document.getElementById('toggleMic');
        const toggleCamBtn = document.getElementById('toggleCam');
        const flipCamBtn = document.getElementById('flipCam');
        let localStream = null, peerConnection = null, isAudioMuted = false, isVideoStopped = false, facingMode = 'user';
        const rtcConfig = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
        async function startCamera() {
            try {
                localStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode }, audio: true });
                localVideo.srcObject = localStream;
            } catch (err) { console.error(err); }
        }
        startCamera();
        socket.on('online-count', count => onlineCount.innerText = count);
        nextBtn.addEventListener('click', () => { resetCall(); socket.emit('next-partner'); socket.emit('find-partner'); });
        socket.on('waiting', () => { statusText.innerText = "جاري البحث عن شخص متصل..."; placeholder.style.display = 'block'; toggleChat(true); });
        socket.on('matched', async (data) => {
            placeholder.style.display = 'none'; toggleChat(false); appendSysMsg("تم التوصيل بنجاح!");
            peerConnection = new RTCPeerConnection(rtcConfig);
            peerConnection.ontrack = e => remoteVideo.srcObject = e.streams[0];
            peerConnection.onicecandidate = e => e.candidate && socket.emit('signal', { candidate: e.candidate });
            localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));
            if (data.shouldInitiate) {
                const offer = await peerConnection.createOffer();
                await peerConnection.setLocalDescription(offer);
                socket.emit('signal', { type: 'offer', offer });
            }
        });
        socket.on('signal', async (data) => {
            if (!peerConnection) return;
            if (data.type === 'offer') {
                await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
                const answer = await peerConnection.createAnswer();
                await peerConnection.setLocalDescription(answer);
                socket.emit('signal', { type: 'answer', answer });
            } else if (data.type === 'answer') {
                await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
            } else if (data.candidate) {
                peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate)).catch(console.error);
            }
        });
        function resetCall() {
            if (peerConnection) { peerConnection.close(); peerConnection = null; }
            remoteVideo.srcObject = null; chatBox.innerHTML = ''; placeholder.style.display = 'block'; statusText.innerText = "اضغط التالي لبدء محادثة جديدة.";
        }
        socket.on('partner-left', () => { appendSysMsg("انقطع اتصال الطرف الآخر."); resetCall(); setTimeout(() => socket.emit('find-partner'), 1200); });
        sendBtn.addEventListener('click', sendMsg);
        msgInput.addEventListener('keypress', e => { if (e.key === 'Enter') sendMsg(); socket.emit('typing', true); });
        function sendMsg() {
            const text = msgInput.value.trim();
            if (text) { socket.emit('chat-message', text); appendMsg(text, 'me'); msgInput.value = ''; socket.emit('typing', false); }
        }
        socket.on('chat-message', text => appendMsg(text, 'them'));
        socket.on('partner-typing', isTyping => typingIndicator.classList.toggle('hidden', !isTyping));
        function appendMsg(text, type) {
            const div = document.createElement('div'); div.classList.add('msg', type); div.innerText = text;
            chatBox.appendChild(div); chatBox.scrollTop = chatBox.scrollHeight;
        }
        function appendSysMsg(text) {
            const div = document.createElement('div'); div.classList.add('msg', 'sys'); div.innerText = text;
            chatBox.appendChild(div); chatBox.scrollTop = chatBox.scrollHeight;
        }
        function toggleChat(disabled) { msgInput.disabled = disabled; sendBtn.disabled = disabled; }
        toggleMicBtn.addEventListener('click', () => { isAudioMuted = !isAudioMuted; if (localStream) localStream.getAudioTracks()[0].enabled = !isAudioMuted; toggleMicBtn.classList.toggle('active-off', isAudioMuted); });
        toggleCamBtn.addEventListener('click', () => { isVideoStopped = !isVideoStopped; if (localStream) localStream.getVideoTracks()[0].enabled = !isVideoStopped; toggleCamBtn.classList.toggle('active-off', isVideoStopped); });
        flipCamBtn.addEventListener('click', async () => { facingMode = facingMode === 'user' ? 'environment' : 'user'; if (localStream) localStream.getTracks().forEach(t => t.stop()); await startCamera(); });
    </script>
</body>
</html>`);
});

let waitingUser = null;
let onlineCount = 0;

io.on('connection', (socket) => {
    onlineCount++;
    io.emit('online-count', onlineCount);

    socket.on('find-partner', () => {
        if (waitingUser && waitingUser.id !== socket.id) {
            const partner = waitingUser;
            waitingUser = null;
            const room = `room_${socket.id}_${partner.id}`;
            socket.join(room);
            partner.join(room);
            socket.room = room;
            partner.room = room;

            socket.emit('matched', { room, shouldInitiate: true });
            partner.emit('matched', { room, shouldInitiate: false });
        } else {
            waitingUser = socket;
            socket.emit('waiting');
        }
    });

    socket.on('signal', (data) => {
        if (socket.room) socket.to(socket.room).emit('signal', data);
    });

    socket.on('chat-message', (msg) => {
        if (socket.room) socket.to(socket.room).emit('chat-message', msg);
    });

    socket.on('typing', (isTyping) => {
        if (socket.room) socket.to(socket.room).emit('partner-typing', isTyping);
    });

    const leaveRoom = () => {
        if (waitingUser && waitingUser.id === socket.id) waitingUser = null;
        if (socket.room) {
            socket.to(socket.room).emit('partner-left');
            socket.leave(socket.room);
            socket.room = null;
        }
    };

    socket.on('next-partner', leaveRoom);
    socket.on('disconnect', () => {
        onlineCount = Math.max(0, onlineCount - 1);
        io.emit('online-count', onlineCount);
        leaveRoom();
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
