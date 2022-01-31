const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give enough arguments')
  process.exit(1)
}

const password = process.argv[2]
console.log(password)

const url =
  `mongodb+srv://fullstack2:${password}@cluster0.9cpiq.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url)

const subjectSchema = new mongoose.Schema({
    name: String,
    number: String,
  })
  
const Subject = mongoose.model('Subject', subjectSchema)

if (process.argv.length<4) {
    Subject.find({}).then(result => {
        result.forEach(subject => {
          console.log(subject)
        })
        mongoose.connection.close()
      })
} else {
    const name = process.argv[3]
    const number = process.argv[4]

    const subject = new Subject({
        name: name,
        number: number,
      })
      
      subject.save().then(result => {
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
      })     
}


