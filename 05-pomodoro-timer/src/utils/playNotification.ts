export const playNotification = () => {
    const audio = new AudioContext();
    const osc = audio.createOscillator();
    osc.connect(audio.destination);
    osc.frequency.value = 600;
    osc.start();
    osc.stop(audio.currentTime + 0.2);
    
    if (Notification.permission === 'granted') {
        new Notification('Timer Complete!', { body: 'Time to take a break!' });
    }
};
