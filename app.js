const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const PORT = process.env.PORT || 3000

const history = [
  {
    message: ``
  }
]
const probability = [
  {
    num: 1,
    color: 'red'
  },
  {
    num: 2,
    color: 'black'
  },
  {
    num: 3,
    color: 'red'
  },
  {
    num: 4,
    color: 'black'
  },
  {
    num: 5,
    color: 'red'
  },
  {
    num: 6,
    color: 'black'
  },
  {
    num: 7,
    color: 'red'
  },
  {
    num: 8,
    color: 'black'
  },
  {
    num: 9,
    color: 'red'
  },
  {
    num: 10,
    color: 'black'
  },
  {
    num: 11,
    color: 'black'
  },
  {
    num: 12,
    color: 'red'
  },
  {
    num: 13,
    color: 'black'
  },
  {
    num: 14,
    color: 'red'
  },
  {
    num: 15,
    color: 'black'
  },
  {
    num: 16,
    color: 'red'
  },
  {
    num: 17,
    color: 'black'
  },
  {
    num: 18,
    color: 'red'
  },
  {
    num: 19,
    color: 'red'
  },
  {
    num: 20,
    color: 'black'
  },
  {
    num: 21,
    color: 'red'
  },
  {
    num: 22,
    color: 'black'
  },
  {
    num: 23,
    color: 'red'
  },
  {
    num: 24,
    color: 'black'
  },
  {
    num: 25,
    color: 'red'
  },
  {
    num: 26,
    color: 'black'
  },
  {
    num: 27,
    color: 'red'
  },
  {
    num: 28,
    color: 'black'
  },
  {
    num: 29,
    color: 'black'
  },
  {
    num: 30,
    color: 'red'
  },
  {
    num: 31,
    color: 'black'
  },
  {
    num: 32,
    color: 'red'
  },
  {
    num: 33,
    color: 'black'
  },
  {
    num: 34,
    color: 'red'
  },
  {
    num: 35,
    color: 'black'
  },
  {
    num: 36,
    color: 'red'
  },
]
let totalPrizeMoney = 50000
let currentresult = {
  num: 1,
  color: 'red'
}
let seconds = 15


// ? socket.io here
io.on('connect', socket => {
  socket.emit('init', { history, totalPrizeMoney, probability })

  // ? play = merandom result
  socket.on('play', () => {
    seconds = 15

    const index = Math.floor(Math.random() * probability.length)
    currentresult = probability[index]

    // ? timer
    const countDown = setInterval(() => {
      io.emit('result', {result: seconds} )
      seconds--
  
      if (seconds < 0) {
        clearInterval(countDown)
        io.emit('result', {result: `${currentresult.num} ${currentresult.color}`} )
        currentresult = 0
      }
    }, 1000)
  })

  // ! jadikan 1.000.000
  socket.on('betting', (payload) => {
    let message = `${payload.name} betting all his money total Rp. ${Number(payload.bet).toLocaleString('id')}`
    history.unshift({ message })
    io.emit('message', { message } )

    if (currentresult.num != payload.num) {

      // ? timer
      const countDown = setInterval(() => {

        if (seconds < 0) {
          clearInterval(countDown)
          totalPrizeMoney += +payload.bet
          message = `${payload.name} Lose, Total Prize Money now is Rp. ${Number(totalPrizeMoney).toLocaleString('id')}`
          history.unshift({ message })

          socket.emit('resultWrong', { bet: payload.bet})
          io.emit('messageWrong', { message, bet: payload.bet } )

        }
      }, 1000)

    } else {

      // ? timer
      const countDown = setInterval(() => {

        if (seconds < 0) {
          clearInterval(countDown)
          message = `${payload.name} Win and got Rp. ${Number(totalPrizeMoney).toLocaleString('id')},- !!!, Total Prize Money Restocked to Rp. 50.000,-`
          history.unshift({ message })
          
          socket.emit('resultRight', { gain: totalPrizeMoney })
          io.emit('messageRight', { message } )
          totalPrizeMoney = 50000

        }
      }, 1000)
      
    }
  })

  socket.on('bettingByColor', (payload) => {
    let message = `${payload.name} bet Rp. ${Number(payload.bet).toLocaleString('id')}`
    history.unshift({ message })
    io.emit('message', { message } )

    if (currentresult.color != payload.color) {

      // ? timer
      const countDown = setInterval(() => {

        if (seconds < 0) {
          clearInterval(countDown)
          totalPrizeMoney += +payload.bet
          message = `${payload.name} Lose, Total Prize Money now is Rp. ${Number(totalPrizeMoney).toLocaleString('id')}`
          history.unshift({ message })

          socket.emit('resultWrong', { bet: payload.bet})
          io.emit('messageWrong', { message, bet: payload.bet } )

        }
      }, 1000)

    } else {

      // ? timer
      const countDown = setInterval(() => {

        if (seconds < 0) {
          clearInterval(countDown)
          message = `${payload.name} Win and got Rp. ${Number(payload.bet).toLocaleString('id')},- !!!`
          history.unshift({ message })
          
          socket.emit('resultRightColor', { gain: payload.bet })
          io.emit('messageRight', { message } )
        }
      }, 1000)
      
    }
  })
});

server.listen(PORT, () => console.log(`This app running on port ${PORT}`));