import { Server } from "socket.io";

export function RegisterSocketEndpoints(io: Server) {
    io.on('connection', (socket) => {
        socket.on('initial', () => {
            socket.emit('handshake');
        });

        socket.on('checkTasks', (message) => {
            let deadTasks: any[] = [];
            let almostDeadTasks: any[] = [];

            message.forEach((e: any) => {
                let deadLine = new Date(parseInt(e.deadline));
                if(deadLine.setHours(0,0,0,0) < new Date().setHours(0,0,0,0)) {
                    deadTasks.push(e);
                }

                if(deadLine.setHours(0,0,0,0) == new Date().setHours(0,0,0,0)) {
                    almostDeadTasks.push(e);
                }
            });

            if(almostDeadTasks.length !== 0) socket.emit('almostDeadTasks', almostDeadTasks);
            if(deadTasks.length !== 0) socket.emit('deadTasks', deadTasks);
        });

        socket.on('globalEvent', (message) => {
            if(message.includes(':')) {
                socket.broadcast.emit('update', { 
                    type: message.split(':')[0], 
                    id: message.split(':')[1]
                });
            } else socket.broadcast.emit('update', { type: message });
        });
    });
}