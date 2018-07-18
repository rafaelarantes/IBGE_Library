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
        <div class="div-search-result" v-show="tableResult.items.length > 0">
            <b-table class="table-search-result" responsive striped hover :items="tableResult.items" :fields="tableResult.fields" :current-page="tableResult.currentPage" :per-page="tableResult.perPage"></b-table>
            <b-pagination :total-rows="tableResult.items.length" :per-page="tableResult.perPage" v-model="tableResult.currentPage" />
        </div>
    </div>
</template>

<script>
import SearchChoiceField from '../../service/SearchChoiceField'
import Search from '../../service/Search'
const items = [
  { isActive: true, age: 40, first_name: 'Dickerson', last_name: 'Macdonald' },
  { isActive: false, age: 21, first_name: 'Larsen', last_name: 'Shaw' },
  { isActive: false, age: 21, first_name: 'Larsen', last_name: 'Shaw' },
  { isActive: false, age: 21, first_name: 'Larsen', last_name: 'Shaw' },
  { isActive: false, age: 21, first_name: 'Larsen', last_name: 'Shaw' },
  { isActive: false, age: 21, first_name: 'Larsen', last_name: 'Shaw' },

]

export default {
    data()	{
        return	{	
            searchChoiceFields: {},
            selected: {
                searchChoiceMaterial:"todos",
                searchChoiceField: "todos",
                searchText: ""
            },
            tableResult: {
                items: items,
                currentPage: 1,
                perPage: 10
            }
        }
    },
    methods: {
        getSearchChoicefield: function() {
            SearchChoiceField.getAll().then((resp) => {
                this.searchChoiceFields = resp.data.data;
            }, (err) => {
                console.log(err.statusText);
            });
        },
        search: function() {
        //this.selected
            Search.get().then((resp) => {
                this.tableResult.items = resp.data.data;
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
.form-search {
    min-width: 205px;
    width: 30%;
    transform: translate(-50%,-50%);
    left:50%;
    position: absolute;
}
.table-search-result {
    margin-top: 260px;
}
</style>


