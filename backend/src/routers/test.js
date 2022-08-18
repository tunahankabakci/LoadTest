const express = require('express')
const router = express.Router()
const LoremIpsum = require("lorem-ipsum").LoremIpsum;



const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 15,
    min: 5
  },
  wordsPerSentence: {
    max: 20,
    min: 5
  }
});



router.get('/time', async(req, res) => {
    const date = new Date();
    res.send(date.toLocaleString())
})

router.get('/paragraph', async(req, res) => {
    res.send(lorem.generateParagraphs(1000))
})


module.exports = router