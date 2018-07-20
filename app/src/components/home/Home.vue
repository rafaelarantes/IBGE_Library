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
                        <b-button size="sm" variant="success" v-on:click="postPublication(row.item)">Adicionar</b-button>
                        <b-button size="sm" @click.stop="row.toggleDetails" v-on:click="getDetailsRowTable(row.item._id)" class="mr-2">
                            {{ row.detailsShowing ? 'Esconder' : 'Mostrar'}} Detalhes
                        </b-button>
                    </template>
                    <template slot="row-details" slot-scope="item"> 
                        <b-card>
                            <b-row class="mb-2" v-for="(value, key, index) in getElementDetailPublication(item.item._id)[0]">
                                <b-col sm="3" class="text-sm-right"><b>{{ value.originalName }}</b></b-col>
                                <b-col>{{ value.value }}</b-col>
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
import Publication from '../../service/Publication';
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
            detailPublication: {
                current: {},
                list: []
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
                label: "Opções"
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
        getDetailsRowTable: function(id) {
            let currentDetail = this.getElementDetailPublication(id);

            if(currentDetail.length > 0){
                return currentDetail[0];
            }else{
                var scope = this;
                scope.detailPublication.current = {};
                SearchDetail.get(id).then((resp) => {
                    scope.detailPublication.list.push(resp.data.data);
                    return resp.data.data;
                }, (err) => {
                    console.log(err.statusText);
                });
            }
        },
        getElementDetailPublication(id){
            if(this.detailPublication.list.length  > 0){
                return this.detailPublication.list.filter(function(elem,i,array) {
                    return elem._id == id;
                });
            }else
                return [];
        },
        postPublication(item){
            if(item){
                Publication.post(item).then((resp) => {
                    console.log("Salvo com sucesso!");
                }, (err) => {
                    console.log(err.statusText);
                });
            }
            
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


