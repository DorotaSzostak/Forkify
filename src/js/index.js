import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import {elements, renderLoader, clearLoader} from './views/base';


/*Global state of app
- Search object
- Current recipe object
- Shopping list object
- Liked recipes
*/

const state = {};
window.state = state;
//SEARCH CONTROLLER
const controlSearch = async ()=>{
  //1. Get query from view
  const query = searchView.getInput();
  if(query){
    //2.New search object and add to state
    state.search = new Search(query);
    try {
    //3. Show spiner and prepare UI for results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes);
    //4. Search for recipes and add it to state object
    await state.search.getRecipes();
    //5.render results on UI
    clearLoader();
    searchView.renderResults(state.search.results);
    } catch (err){
      alert("Can't search recipes" )
    }
  }
}


elements.searchForm.addEventListener('submit', e=>{
  e.preventDefault();
  controlSearch();

});

elements.pagination.addEventListener('click', e=> {
  const btn = e.target.closest('.btn-inline')
  if(btn) {
    const goToPage = parseInt(btn.dataset.goto, 10)
    searchView.clearResults();
    searchView.renderResults(state.search.results, goToPage);
  }
});

//RECIPE CONTROLLER
const controlRecipe = async () =>{
  //Get ID from url
  const id = window.location.hash.replace('#', '');
  //console.log(id)
  if(id){
    //prepare UI for changes
    recipeView.clearResults();
    renderLoader(elements.recipeView);
    //Highlight selected search item
    if(state.search){
      recipeView.highlightSelected(id);
    }
    //create new recipe object
    state.recipe = new Recipe(id);
    try {
    //get recipe dataset and parse ingredient
    await state.recipe.getRecipe();
    state.recipe.parseIngredients();
    //calculate serving and time
    state.recipe.calcTime();
    state.recipe.calcServings();
    //render recipe
    clearLoader();
    recipeView.renderRecipe(state.recipe);
    //console.log(state.recipe)
    } catch (err){
      alert ("Can't render recipe")
    }
  }
}


window.addEventListener('hashchange', controlRecipe);
window.addEventListener('load', controlRecipe);

//LIST CONTROLLER
const controlList = async => {
  //Create new list if there is none yet
  if(!state.list) state.list = new List();
  //Add each ingredient to the list and UI
  state.recipe.ingredients.forEach(el => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  });
}

//Handle delete and update list item events
elements.shoppingList.addEventListener('click', e=> {
  const id = e.target.closest('.shopping__item').dataset.itemid;

  //handle delete item
  if(e.target.matches('.shopping__delete, .shopping__delete *')){
    //delete from state
    state.list.deleteItem(id)
    //delete from UI
    listView.deleteItem(id);
  } else if (e.target.matches('.shopping__count-value')){
    const val = parseFloat(e.target.value, 10);
    state.list.updateCount(id, val);
  }
});

//Handling recipe button clicks
elements.recipeView.addEventListener('click', e=> {
    if(e.target.matches('.btn-decrease, .btn-decrease *')){
        if(state.recipe.servings > 1){
      state.recipe.updateServings('dec')
      recipeView.updateServingsIngredients(state.recipe);
    }
    } else if (e.target.matches('.btn-increase, .btn-increase *')){
      state.recipe.updateServings('inc')
      recipeView.updateServingsIngredients(state.recipe);
  } else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
    controlList();
  }
});

const l = new List ();
window.l = l;
