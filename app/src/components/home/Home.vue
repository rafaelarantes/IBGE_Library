<template>
    <div id="home">
        <div class="div-logo">
            <img class="img-logo" src="../../assets/images/logo.png"/>
        </div>
        <div>
            <form class="form-search">
                <div class="form-group">
                    <select class="form-control" name="choiceMaterial" v-model="selected.searchChoiceMaterial" >
                        <option v-for="(value, key, index) in searchChoiceFields" :value="key" >{{value[0].name}}</option> 
                    </select>
                </div>
                <div class="form-group"> 
                    <select class="form-control" name="choiceField" v-model="selected.searchChoiceField">
                        <option v-for="(value, key, index) in searchChoiceFields[selected.searchChoiceMaterial] ? searchChoiceFields[selected.searchChoiceMaterial][1] : {}" >{{value}}</option> 
                    </select>
                </div>
                <div class="form-group">
                    <input type="text" class="form-control" id="searchText" v-model="selected.searchText" placeholder="Faça sua busca">
                </div>
                <div class="form-group">
                    <button type="button" class="btn btn-info btn-lg btn-block" v-on:click="search">Buscar</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import SearchChoiceField from '../../service/SearchChoiceField'
import Search from '../../service/Search'

export default {
  data()	{	return	{	searchChoiceFields:	{}, selected: { searchChoiceMaterial:"todos", searchChoiceField: "todos", searchText: "" } } 	},
  methods: {
    getSearchChoicefield: function() {
      SearchChoiceField.getAll().then((resp) => {
          this.searchChoiceFields = resp.data;
      }, (err) => {
          console.log(err.statusText);
      });
    },
    search: function() {
      //this.selected
      Search.get().then((resp) => {

      }, (err) => {
          console.log(err.statusText);
      });
    }
  },
  mounted: function () {
    this.getSearchChoicefield();
  }
}
</script>

<style>
.form-search {
    min-width: 250px;
    width: 30%;
    transform: translate(-50%,-50%);
    left:50%;
    position: absolute;
}
.div-logo {
    margin-bottom: 130px;
    width: 100%;
    height: auto;
    text-align: center;
    
}
.img-logo {
    width: 50%;
    height: auto;
    position: relative;
    max-width: 400px;
    min-width: 200px;
}
</style>


