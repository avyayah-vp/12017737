const express = require('express');
const app = express();
const axios = require('axios');
const port = 3000;

function quickSort(arr) {
    if (arr.length <= 1) {
        return arr;
    }
    const pivot = arr[0];
    let left = [];
    let right = [];
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] < pivot) {
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }
    return [...quickSort(left), pivot, ...quickSort(right)];
}

app.get('/numbers', async (req, res) => {
    const urls = req.query.url;
    let numbers = [];
    let promises = [];
    if (Array.isArray(urls)) {
        for (let i = 0; i < urls.length; i++) {
            promises.push(axios.get(urls[i], { timeout: 500 }));
        }
    } else if (typeof urls === 'string') {
        promises.push(axios.get(urls, { timeout: 500 }));
    }
    try {
        const responses = await Promise.allSettled(promises);
        for (let i = 0; i < responses.length; i++) {
            if (responses[i].status === 'fulfilled') {
                numbers = numbers.concat(responses[i].value.data.numbers);
            }
        }
    } catch (error) {
        console.log(error);
    }
    numbers = [...new Set(numbers)];
    numbers = quickSort(numbers);
    res.json({ numbers: numbers });
});

app.listen(port, () => {
    console.log(`Number management service listening at http://localhost:${port}`);
});
