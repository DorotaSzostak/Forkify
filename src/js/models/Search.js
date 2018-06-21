import axios from 'axios';

export default class Search {
  constructor(query){
    this.query = query;
  }
  async getRecipes() {
    const proxy = "https://cors-anywhere.herokuapp.com/";
    const key = "32d833eac523e38eecb6b1c89f907ae8";
    try {
    const res = await axios.get(`${proxy}http://food2fork.com/api/search?key=${key}&q=${this.query}`)
    this.results = res.data.recipes
    //console.log(this.results)
    } catch(error){
    alert(error)
    }
  }
}


// Global app controller
// API Key: 32d833eac523e38eecb6b1c89f907ae8

//http://food2fork.com/api/search
