const app = require('./app')
const port = process.env.PORT || 2525





app.listen(port, () => { console.log(`port : ${port}`) } )