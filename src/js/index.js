import Search from './models/Search';
import * as searchView from './views/searchView';
import {elements, renderLoader, clearLoader} from './views/base';


/*Global state of app
- Search object
- Current recipe object
- Shopping list object
- Liked recipes
*/

const state = {};

const controlSearch = async ()=>{
  //1. Get query from view
  const query = searchView.getInput();
  if(query){
    //2.New search object and add to state
    state.search = new Search(query);
    //3. Show spiner and prepare UI for results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes);
    //4. Search for recipes and add it to state object
    await state.search.getRecipes();
    //5.render results on UI
    clearLoader();
    searchView.renderResults(state.search.results);
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
})
