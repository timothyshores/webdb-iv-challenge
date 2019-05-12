const router = require('express').Router();
const Recipes = require('./recipes-model');
const Dishes = require('../dishes/dishes-model');

router.get('/', (req, res) => {
    const message500 = { message: 'Unable to get recipes' };

    Recipes.getRecipes()
        .then(recipes => {
            res.status(200).json(recipes);
        })
        .catch(error => { res.status(500).json(message500); });
});

router.get('/:id', (req, res) => {
    const message404 = { error: "The recipe with the specified ID does not exist." }
    const message500 = { error: "The recipe information could not be retrieved." }

    Recipes
        .getRecipe(req.params.id)
        .then(recipe => {
            Dishes.getDishes()
                .then(dishes => {
                    const { dish_name } = dishes.filter(dish => dish.id == recipe.dish_id)[0];
                    dish_name
                        ? res.status(200).json({ ...recipe, dish_name})
                        : res.status(404).json(message404);
                })
                .catch(error => {
                    res.status(500).json({ message: 'Unable to get dishes'});
                });
        })
        .catch(err => {
            res.status(500).json(message500)
        })
});

router.post('/', (req, res) => {
    const { recipe_name, dish_id, instructions } = req.body;
    const message400 = { error: "Please provide recipe_name, dish_id and instructions for the recipe" }
    const message500 = { error: "There was an error while saving the recipe to the database" };

    if (recipe_name, dish_id, instructions) {
        Recipes.addRecipe(req.body)
            .then(recipe => { res.status(201).json(recipe) })
            .catch(err => { res.status(500).json(message500) })
    }
    else {
        res.status(400).json(message400);
    }
});

module.exports = router;