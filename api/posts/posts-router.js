// implement your posts router here
const express = require('express')
const PostM = require('./posts-model')
const router = express.Router()

router.get('/', async(req, res) => {
    try {
        const posts = await PostM.find()
        if(!posts) {
            res.status(404).json({message: 'Could not find posts'}) 
        } else {
            res.json(posts)
        }
    } catch {
        res.status(500).json({message: err.message})
    }
})

router.get('/:id', async(req, res) => {
    try {
        const {id} = req.params
        const post = await PostM.findById(id)
        if (!post) {
            res.status(404).json({
                message: 'The post with the specified ID does not exist'
            })
        } else {
            res.json(post)
        }
    } catch(err) {
        res.status(500).json({message: err.message})
    }
})

router.post('/', async(req, res) => {
    try {
        const {title, contents} = req.body
        const newPost = await PostM.insert({title, contents})
        const post = await PostM.findById(newPost.id)
        if (!title || !contents) {
            res.status(400).json({
                message: 'Please provide title and contents for the post'
            })
        }
         else {
            res.status(201).json(post) 
        }
    } catch(err) {
        res.status(500).json({message: 'There was an error while saving the post to the database'})
    }
})

router.put('/:id', async(req, res) => {
    try {
        const {id} = req.params
        const {title, contents} = req.body
        console.log(id, title, contents)
        const updatePost = await PostM.update(id, req.body)
        const post = await PostM.findById(id)
        console.log(post)
        if (!updatePost) {
            res.status(404).json({
                message: 'The post with the specified ID does not exist'
            })
        } else if (!title || !contents) {
            res.status(400).json({
                message: 'Please provide title and contents for the post'
            })
        } else {
            res.status(200).json(post)
        }
    } catch(err) {
        res.status(500).json({message: 'The post information could not be modified'})
    }
})

router.delete('/:id', async(req, res) => {
    try {
        const {id} = req.params
        const post = await PostM.findById(id)
        const deletePost = await PostM.remove(id)
        if(!deletePost) {
            res.status(404).json({message: 'he post with the specified ID does not exist'})
        } else {
            res.json(post) 
        }
    } catch(err) {
        res.status(500).json({message: 'The post could not be removed'})
    }
})

router.get('/:id/comments', async(req, res) => {
    try {
        const {id} = req.params
        const post = await PostM.findById(id)
        console.log(post)
        const message = await PostM.findPostComments(id)
        if (!post) {
            res.status(404).json({
                message: 'The post with the specified ID does not exist'
            })
        } else {
            res.json(message)
        }
    } catch(err) {
        res.status(500).json({message: 'he comments information could not be retrieved'})       
    }
})

module.exports = router
