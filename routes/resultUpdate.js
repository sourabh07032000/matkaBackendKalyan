const express = require('express');
const router = express.Router();
const User = require('../models/User');
const mongoose = require('mongoose');


router.put(';/id', async (req, res) => {
  try { 
        // FormData for the external API request
        let data = new FormData();
        data.append('username', '8889223659');
        data.append('API_token', 'NY3ni3VQS82tEmdp');
        data.append('markte_name', ''); // Corrected field spelling
        data.append('date', '2024-12-27');
        // Axios configuration
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://matkawebhook.matka-api.online/market-data',
            headers: { 
                'Cookie': 'ci_session=pv0avqseb6d2u7eaoug27o2100k1hpk6', 
                ...data.getHeaders()
            },
            data: data
        };
        // Make request to the external API
        const response = await axios.request(config);
        res.json(response.data); // Send the API response back to the frontend

        //Checking Result
        const user = await User.findById(req.params.id)
        const pendingBets = user.betDetails.filter((i)=> i.status == "Pending")
        for (let i of pendingBets){
              const betNameType = i?.matkaBetType?.category == "Single Digit" &&  betTime == "Open" ? "figure_open" : i?.matkaBetType?.category == "Single Digit" &&  i?.matkaBetType?.category == "Close" ? "figure_close" :
                             i?.matkaBetType?.category == "Jodi Digit" ? "jodi" : 
                             i?.matkaBetType?.category == "Single Panna" && betTime == "Open" ? "aankdo_open" : i?.matkaBetType?.category == "Single Panna" && betTime == "Close" ? "aankdo_close" :
                              i?.matkaBetType?.category == "Double Panna" && betTime == "Open" ? "aankdo_open" : i?.matkaBetType?.category == "Double Panna" && betTime == "Close" ? "aankdo_close" :
                              i?.matkaBetType?.category == "Triple Panna" && betTime == "Open" ? "aankdo_open" : i?.matkaBetType?.category == "Triple Panna" && betTime == "Close" ? "aankdo_close" :
                               i?.matkaBetType?.category == "Half Sangam" && betTime == "Open" ? "aankdo_open" : i?.matkaBetType?.category == "Half Sangam" && betTime == "Close" ? "aankdo_close" :
                               null
            let resultNumber = response.data?.today_result?.filter((i)=> i.market_id == i.marketId)[0][`${betNameType}`]

          if (resultNumber == i.matkaBetNumber){
            const user = await User.findByIdAndUpdate(
              req.params.id,
               {wallet: user.wallet + i.betAmount*i.matkaBetType.multiplier/10},
              { new: true, runValidators: true }
              );
          }
        }
    } catch (error) {
        console.error('Error fetching market data:', error.message);
        res.status(500).json({ error: 'Failed to fetch market data' });
    }
})

module.exports = router;
