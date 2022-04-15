import {DefaultEventsMap} from "@socket.io/component-emitter";
import {NextPage} from "next";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {io, Socket} from "socket.io-client";
import {EVENTS} from "../events/events";
import moment, {Moment} from "moment";
import {Timer, TimerWrapper} from "../components/Timer";
import {ContainerWrapper} from "../components/ContainerWrapper";
import {ButtonWrapper, StyledButton} from "../components/Button";

const Room: NextPage = () => {
  const router = useRouter()
  const {room} = router.query
  const [workTimers, _] = useState([10, 15, 20, 25, 30])
  const [workTime, setWorkTime] = useState(0)
  const [timer, setTimer] = useState<Moment>(getZeroTimer())

  let socket: Socket<DefaultEventsMap, DefaultEventsMap> = io();

  let interval: NodeJS.Timer;

  // @ts-ignore
  useEffect(() => socketInitializer(), [])

  useEffect(() => sendJoinedEvent(), [room])

  useEffect(() => {
    if (isZero(timer)) return;

    interval = setInterval(() => {
      setTimer(() => moment(timer).subtract(1, 'second'))
    }, 1000);

    return () => clearInterval(interval);
  }, [timer])

  useEffect(() => {
    if (timer) {
      if (timer.seconds() === 0 && timer.minutes() === 0) {
        const audio = new Audio('https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3');
        audio.play();

        clearInterval(interval)
      }
    }
  }, [timer])

  const socketInitializer = async () => {
    await fetch('/api/socket')

    socket.on('connect', () => {
      console.log('connected')
    })

    socket.on(EVENTS.WORK_TIME_SELECTED, (payload) => {
      setWorkTime(payload.timer)
    })

    socket.on(EVENTS.TIMER_STARTED, (payload) => {
      if (!payload[getRoomName()]) return;

      let timeRemaining = moment(payload[getRoomName()].timerEnd).diff(moment(), 'milliseconds');
      setTimer(moment(timeRemaining))
    })

    socket.on(EVENTS.TIMER_STOPPED, (room) => {
      if (room !== getRoomName()) return;

      setTimer(getZeroTimer())
    })
  }

  const sendJoinedEvent = () => {
    socket.emit(EVENTS.USER_JOINED_THE_ROOM, {room: room})
  };

  const getRoomName = () => window.location.pathname.replace('/', '');

  function timerOnClick(timer: number) {
    setWorkTime(timer);
    // actions.timerSelected(timer);
    socket.emit(EVENTS.WORK_TIME_SELECTED, {timer: timer, room: room})
  }

  function startTimer() {
    socket.emit(EVENTS.TIMER_STARTED, {timer: workTime, room: room})
  }

  function stopTimer() {
    socket.emit(EVENTS.TIMER_STOPPED, {room: room})
  }

  function renderTimer(timer: number) {
    return <Timer onClick={() => timerOnClick(timer)}>{timer}</Timer>;
  }

  function renderMinutesAndSeconds() {
    return moment(timer).format('mm:ss');
  }

  function getZeroTimer() {
    const m = moment().utcOffset(0);
    m.set({hour: 0, minute: 0, second: 0, millisecond: 0})
    m.toISOString()
    m.format()
    return m;
  }

  function isZero(timer: moment.Moment) {
    return timer.minutes() === 0 && timer.seconds() === 0;
  }

  return (
    <ContainerWrapper>
      <h1>Welcome to the {room} !</h1>
      <h2>Choose your work timer:</h2>
      <h3>
        <TimerWrapper>
          {workTimers.map(timer => renderTimer(timer))}
        </TimerWrapper>
      </h3>
      <h3>You have selected: {workTime}</h3>

      <ButtonWrapper>
        <StyledButton background="#02b3e4" onClick={() => startTimer()}>Start !</StyledButton>
        <StyledButton background="#e43c02" onClick={() => stopTimer()}>Stop</StyledButton>
      </ButtonWrapper>

      <h1>Timer: {`${(renderMinutesAndSeconds())}`}</h1>
    </ContainerWrapper>
  )
};

export default Room;