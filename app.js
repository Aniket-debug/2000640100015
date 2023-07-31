const express = require('express');
const axios = require('axios');

const app = express();

const nums = async (url) => {
    console.log(url);
    try {
        const res = await axios.get(url, { timeout: 5000 });
        return res.data.numbers || [];
    } catch (error) {
        return [];
    }
};

const getdistinctnums = async (urls) => {
    console.log(urls);
    const promises = urls.map(nums);
    const results = await Promise.all(promises);
    const final_ans = [...new Set(results.flat())];
    console.log(final_ans);
    return final_ans.sort((a, b) => a - b);
};

const isvalid = (url) => {
    try {
        new URL(url);
        return true;
    } catch (error) {
        return false;
    }
};

app.get('/numbers', async (req, res) => {

    const urls = req.query.url || [];
    const validUrls = urls.filter(isvalid);

    try {
        const final_ans = await getdistinctnums(validUrls);
        res.json({ numbers: final_ans });
    } catch (error) {
        res.status(500).json({ error: 'an error' });
    }
});

app.listen(3000, () => {
    console.log(`Server started on http://localhost:3000`);
});
