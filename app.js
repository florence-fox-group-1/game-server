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
]
let totalPrizeMoney = 50000

io.on('connect', socket => {
  socket.emit('init', { history, totalPrizeMoney, probability })
  // ! jadikan 1.000.000
  socket.on('betting', (payload) => {
    let message = `${payload.name} bet Rp. ${Number(payload.bet).toLocaleString('id')}`
    history.push({ message })
    io.emit('message', { message } )

    const index = Math.floor(Math.random() * probability.length)

    if (probability[index].num != payload.num) {
      totalPrizeMoney += +payload.bet
      message = `${payload.name} Kalah, Total Prize Money bertambah menjadi ${ totalPrizeMoney }`
      history.push({ message })

      socket.emit('resultWrong', { bet: payload.bet})
      io.emit('messageWrong', { message, bet: payload.bet } )
    } else {
      message = `${payload.name} Menang Sejumlah Rp. ${totalPrizeMoney},- !!!, Total Prize Money di stock ulang oleh bandar menjadi Rp. 50.000,-`
      history.push({ message })
      
      socket.emit('resultRight', { gain: totalPrizeMoney })
      io.emit('messageRight', { message } )
      totalPrizeMoney = 50000
    }

    io.emit('result', {result: probability[index]} )
  })
});

server.listen(PORT, () => console.log(`This app running on port ${PORT}`));