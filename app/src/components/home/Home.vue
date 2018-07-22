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
        <div class="response-message">
            <b-alert :show="response.success" variant="success" dismissible>{{ response.message }} </b-alert>
            <b-alert :show="response.error" variant="danger" dismissible>{{ response.message }}</b-alert>
            <b-alert :show="response.information" variant="dark" dismissible>{{ response.message }}</b-alert>
        </div>
        <div class="div-search-result" v-show="tableResult.items && tableResult.items.length && tableResult.items.length > 0">
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
            <b-pagination :total-rows="tableResult.items && tableResult.items.length ? tableResult.items.length : 0" :per-page="tableResult.perPage" v-model="tableResult.currentPage" />
        </div>
        <b-modal v-model="modalProgressShow" ok-disabled cancel-disabled hide-footer hide-header no-close-on-esc no-close-on-backdrop>
            <b>Por favor, aguarde...</b>
            <b-progress :value="100" variant="success" striped animated class="mb-2"></b-progress>
        </b-modal>
    </div>
</template>

<script>
import SearchChoiceField from '../../service/SearchChoiceField';
import Search from '../../service/Search';
import SearchDetail from '../../service/SearchDetail';
import Publication from '../../service/Publication';
export default {
    data()	{
        return	{	
            searchChoiceFields: {},
            modalProgressShow: false,
            response: {
                success: false,
                error: false,
                information: false,
                message: ""
            },
            selected: {
                searchChoiceMaterial:"todos",
                field: "todos",
                text: ""
            },
            tableResult: {
                items: [],
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
            this.modalProgressShow = true;
            
            SearchChoiceField.getAll().then((resp) => {
                this.setStatusResponse(resp.data);
                this.searchChoiceFields = resp.data.data;
                this.modalProgressShow = false;
            }, (err) => {
                console.log(err.statusText);
                this.modalProgressShow = false;
            });
        },
        search: function() {
            this.modalProgressShow = true;
            
            Search.get(this.selected).then((resp) => {
                this.setStatusResponse(resp.data);
                this.tableResult.items = resp.data.data;
                this.modalProgressShow = false;
            }, (err) => {
                console.log(err.statusText);
                this.modalProgressShow = false;
            });
        },
        getDetailsRowTable: function(id) {
            let currentDetail = this.getElementDetailPublication(id);

            if(currentDetail && currentDetail.length > 0){
                return currentDetail[0];
            }else{
                var scope = this;
                scope.detailPublication.current = {};
                scope.modalProgressShow = true;
                SearchDetail.get(id).then((resp) => {
                    scope.detailPublication.list.push(resp.data.data);
                    scope.setStatusResponse(resp.data);
                    scope.modalProgressShow = false;
                    return resp.data.data;
                }, (err) => {
                    console.log(err.statusText);
                    scope.modalProgressShow = false;
                });
            }
        },
        getElementDetailPublication(id){
            if(this.detailPublication.list && this.detailPublication.list.length && this.detailPublication.list.length  > 0){
                return this.detailPublication.list.filter(function(elem,i,array) {
                    return elem._id == id;
                });
            }else
                return [];
        },
        postPublication(item){
            if(item){
                this.modalProgressShow = true;
                Publication.post(item).then((resp) => {
                    this.setStatusResponse(resp.data);
                    if(this.response.success){
                        this.tableResult.items = this.tableResult.items.filter(function(elem,i,array) {
                            return elem._id != item._id;
                        });
                    }
                    this.modalProgressShow = false;
                }, (err) => {
                    console.log(err.statusText);
                    this.modalProgressShow = false;
                });
            }
            
        },
        setStatusResponse(resp){
            if(resp.message){
                this.response.message = resp.message;
                this.response.success = resp.success;
                this.response.error = resp.error;
                this.response.information = resp.information;
            }else{
                this.response.message = false;
                this.response.success = false;
                this.response.error = false;
                this.response.information = false;
            }
            console.log(this.response);

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
    position: relative;
}
.response-message {
    margin-top: 260px;
    text-align: center;
    position: relative;
    
}
</style>


