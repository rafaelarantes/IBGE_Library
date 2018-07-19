<template>
    <div id="home">
        <div class="div-logo">
            <img class="img-logo" src="../../assets/images/logo.png"/>
        </div>
        <div>
            <form class="form-search">
                <div class="form-group">
                    <select class="form-control" name="choiceMaterial" v-model="selected.material" >
                        <option v-for="(value, key, index) in searchChoiceFields" :value="key" >{{value[0].name}}</option> 
                    </select>
                </div>
                <div class="form-group"> 
                    <select class="form-control" name="choiceField" v-model="selected.field">
                        <option v-for="(value, key, index) in searchChoiceFields[selected.material] ? searchChoiceFields[selected.material][1] : {}" :value="key" >{{value}}</option> 
                    </select>
                </div>
                <div class="form-group">
                    <input type="text" class="form-control" id="searchText" v-model="selected.text" placeholder="Faça sua busca">
                </div>
                <div class="form-group">
                    <button type="button" class="btn btn-info btn-lg btn-block" v-on:click="search">Buscar</button>
                </div>
            </form>
        </div>
        <div class="div-search-result" v-show="tableResult.items.length > 0">
            <b-table class="table-search-result" responsive striped fixed hover :items="tableResult.items" :fields="fieldsTable"  :current-page="tableResult.currentPage" :per-page="tableResult.perPage">
                    <template slot="show_details" slot-scope="row">
                        <b-button v-on:click="details()" size="sm" @click.stop="row.toggleDetails" class="mr-2">
                            {{ row.detailsShowing ? 'Esconder' : 'Mostrar'}} Detalhes
                        </b-button>
                    </template>
                    <template slot="row-details" slot-scope="item"> 
                        <b-card>
                            <b-row class="mb-2" v-for="(value, key, index) in detailsRowTable(item._id)">
                                <b-col sm="3" class="text-sm-right">
                                    <b>{{ value }}</b>
                                </b-col>
                                <b-col>
                                    {{ value }}
                                </b-col>
                            </b-row>
                        </b-card>
                    </template>
            </b-table>
            <b-pagination :total-rows="tableResult.items.length" :per-page="tableResult.perPage" v-model="tableResult.currentPage" />
        </div>
    </div>
</template>

<script>
import SearchChoiceField from '../../service/SearchChoiceField';
import Search from '../../service/Search';
import SearchDetail from '../../service/SearchDetail';
const items = [];
export default {
    data()	{
        return	{	
            searchChoiceFields: {},
            selected: {
                searchChoiceMaterial:"todos",
                field: "todos",
                text: ""
            },
            tableResult: {
                items: items,
                currentPage: 1,
                perPage: 10
            },
            fieldsTable: [{
                key: "title",
                label: "Título"
            },{
                key: "author",
                label: "Autor"
            },{
                key: "year",
                label: "Ano"
            },{
                key: "show_details",
                label: "Detalhes"
            }]
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
            Search.get(this.selected).then((resp) => {
                this.tableResult.items = resp.data.data;
            }, (err) => {
                console.log(err.statusText);
            });
        },
        detailsRowTable: function(id) {
            SearchDetail.get(id).then((resp) => {
                return resp.data.data;
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


