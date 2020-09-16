const express = require('express')
const router = express.Router()
const axios = require("axios").default
const btoa = require('btoa')
const FormData = require('form-data')

const fetch = require("node-fetch")

module.exports = client => {
    router.get('/login', (req, res) => {
        res.redirect([
            `https://discord.com/api/oauth2/authorize?`,
            `client_id=${client.user.id}`,
            `&redirect_uri=${encodeURIComponent(client.config.web.redirectURI)}`,
            `&response_type=code&scope=identify%20email%20guilds`
        ].join(""))
    })

    router.get("/callback", (req, res) => {
        if (!req.query.code) {
            return res.status(400).send("You didn't supply a callback code-")
        }
        const authorizationData = new FormData()
        authorizationData.append('client_id', client.user.id);
        authorizationData.append('client_secret', client.config.web.clientSecret);
        authorizationData.append('grant_type', 'authorization_code');
        authorizationData.append('redirect_uri', client.config.web.redirectURI)
        authorizationData.append('scope', 'identify%20email%20guilds`');
        authorizationData.append('code', req.query.code);

        // axios.post("https://discord.com/api/v6/oauth2/token", authorizationData, {
        //     headers: {
        //         "Content-type": "x-www-form-urlencoded"
        //     }
        // })
        fetch('https://discordapp.com/api/oauth2/token', {
            method: 'POST',
            body: authorizationData
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                axios.get("https://discordapp.com/api/users/@me", {
                    headers: {
                        authorization: `${data.token_type} ${data.access_token}`
                    }
                })
                    .then((response) => {
                        const user = response.data
                        user.tag = `${user.username}#${user.discriminator}`;
                        user.avatarURL = user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=1024` : null;
                        req.session.user = user;
                        res.redirect("/")
                    })
                    .catch(e => {
                        res.status(500).send("An error occurred? 🙄")
                        console.error(e)
                    })
            }).catch(e => {
                res.status(500).send("An error occurred? 🙄")
                console.error(e)
            })
    })

    return {
        path: '/discord',
        router
    }
}