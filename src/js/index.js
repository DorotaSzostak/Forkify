import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import {elements, renderLoader, clearLoader} from './views/base';


/*Global state of app
- Search object
- Current recipe object
- Shopping list object
- Liked recipes
*/

const state = {};
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
    } catch (err){
      alert ("Can't render recipe")
    }
  }
}


window.addEventListener('hashchange', controlRecipe);
window.addEventListener('load', controlRecipe);
