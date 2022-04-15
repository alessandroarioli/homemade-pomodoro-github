// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest} from 'next'
import {Server} from "socket.io";
import {EVENTS} from "../../events/events";
import moment from "moment";

type RoomsWithTimer = {
  [room: number]: {
    timerEnd: moment.Moment,
    timerStarted: moment.Moment
  },
}

let storage: RoomsWithTimer[] = []

export default function handler(
  req: NextApiRequest,
  res: any
) {
  if (res.socket.server.io) {
    console.log('Socket is already running')
  } else {
    console.log('Socket is initializing')
    const io = new Server(res.socket.server)
    res.socket.server.io = io

    io.on('connection', socket => {
      socket.on(EVENTS.TIMER_STARTED, roomWithSelectedTimer => {
        let now = moment();
        let timerEnd = now.clone().add(roomWithSelectedTimer.timer, 'minutes');
        let payload = {
          timerStarted: now,
          timerEnd: timerEnd,
        };
        storage.push({
          [roomWithSelectedTimer.room]: payload
        })
        socket.broadcast.emit(EVENTS.TIMER_STARTED, {[roomWithSelectedTimer.room]: payload})
      })

      socket.on(EVENTS.TIMER_STOPPED, payload => {
        storage = storage.filter(element => element[payload.room])

        socket.broadcast.emit(EVENTS.TIMER_STOPPED, payload.room)
      })

      socket.on(EVENTS.USER_JOINED_THE_ROOM, payload => {
        const filteredStorage = storage.find(element => element[payload.room])

        if (!filteredStorage) return;

        const roomStorage = filteredStorage[payload.room]

        socket.broadcast.emit(EVENTS.TIMER_STARTED, {[payload.room]: roomStorage})
      })
    })
  }
  res.end()
  // res.status(200).json({ name: 'John Doe' })
}
