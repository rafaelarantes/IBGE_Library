<template>
    <div id="home">
        <div class="div-logo">
            <img class="img-logo" src="../../assets/images/logo.png"/>
        </div>
        <div>
            <form class="form-search" v-on:submit.prevent="search">
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
                        <div class="options-result">
                            <b-button size="sm" variant="success" v-on:click="postPublication(row.item)"><custom-icon name="plus" base-class="custom-icon"></custom-icon></b-button>
                            <b-button size="sm" @click.stop="row.toggleDetails" v-on:click="getDetailsRowTable(row.item._id)" class="mr-2">
                                <custom-icon v-show="row.detailsShowing" name="zoom-out" base-class="custom-icon"></custom-icon>
                                <custom-icon v-show="!row.detailsShowing" name="zoom-in" base-class="custom-icon"></custom-icon>
                            </b-button>
                        </div>

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
import customIcon from 'vue-icon/lib/vue-feather.esm';

var self = this;

export default {
    components: {
        customIcon
    },
    data()	{
        return	{	
            baseClass: 'v-icon',
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
            self.modalProgressShow = true;
            
            SearchChoiceField.getAll().then((resp) => {
                self.setStatusResponse(resp.data);
                self.searchChoiceFields = resp.data.data;
                self.modalProgressShow = false;
            }, (err) => {
                console.log(err.statusText);
                self.modalProgressShow = false;
            });
        },
        search: function() {
            self.modalProgressShow = true;
            
            Search.get(self.selected).then((resp) => {
                self.setStatusResponse(resp.data);
                self.tableResult.items = resp.data.data;
                self.modalProgressShow = false;
            }, (err) => {
                console.log(err.statusText);
                self.modalProgressShow = false;
            });
        },
        getDetailsRowTable: function(id) {
            return new Promise((resolve, reject) => {
                let currentDetail = self.getElementDetailPublication(id);

                if(currentDetail && currentDetail.length > 0){
                    resolve(currentDetail[0]);
                }else{
                    self.getDetail(id).then((data) => {
                        return resolve(data);
                    }, (err) => {
                        console.log(err.statusText);
                    });
                }
            });

        },
        getDetail: function(id){
            return new Promise((resolve, reject) => {
                self.detailPublication.current = {};
                self.modalProgressShow = true;
                SearchDetail.get(id).then((resp) => {
                    self.detailPublication.list.push(resp.data.data);
                    self.setStatusResponse(resp.data);
                    self.modalProgressShow = false;
                    resolve(resp.data.data);
                }, (err) => {
                    console.log(err.statusText);
                    self.modalProgressShow = false;
                    reject();
                });
            });
        },
        getElementDetailPublication(id){
            if(self.detailPublication.list && self.detailPublication.list.length && self.detailPublication.list.length  > 0){
                return self.detailPublication.list.filter(function(elem,i,array) {
                    return elem._id == id;
                });
            }else
                return [];
        },
        postPublication(item){
            if(item){
                self.modalProgressShow = true;

                self.getDetailsRowTable(item._id).then((currentItem) => {
                    Publication.post(currentItem).then((resp) => {
                        self.setStatusResponse(resp.data);
                        if(self.response.success){
                            self.tableResult.items = self.tableResult.items.filter(function(elem,i,array) {
                                return elem._id != item._id;
                            });
                        }

                        window.scrollTo(0, 0);
                        self.modalProgressShow = false;
                    }, (err) => {
                        console.log(err.statusText);
                        self.modalProgressShow = false;
                    });
                });
            }
            
        },
        setStatusResponse(resp){
            if(resp.message){
                self.response.message = resp.message;
                self.response.success = resp.success;
                self.response.error = resp.error;
                self.response.information = resp.information;
            }else{
                self.response.message = false;
                self.response.success = false;
                self.response.error = false;
                self.response.information = false;
            }
        }
    },
    mounted: function () {
        self = this;
        self.getSearchChoicefield();
    }
}
</script>

<style>
@media (min-width: 991px) {
    .img-logo {
        width: 50%;
        height: auto;
        position: relative;
        max-width: 400px;
        min-width: 200px;
    }

    .form-search {
        min-width: 410px;
        width: 30%;
        transform: translate(-50%,-50%);
        left:50%;
        position: absolute;
    }

    .response-message {
        margin-top: 260px;
        text-align: center;
        position: relative;
        
    }

    .options-result {
        display: flex;
        justify-content: space-around;
        padding: 0% 25% 0% 25%;
    }
}

@media (max-width: 990px) {
    .img-logo {
        width: 60%;
        height: auto;
        position: relative;
        max-width: 700px;
        min-width: 400px;
    }

    .form-search {
        min-width: 410px;
        width: 60%;
        transform: translate(-50%,-50%);
        left:50%;
        position: absolute;
    }

    .response-message {
        margin-top: 260px;
        text-align: center;
        position: relative;
        
    }

    .options-result {
        display: flex;
        justify-content: space-around;
    }
}
.div-logo {
    margin-bottom: 130px;
    width: 100%;
    height: auto;
    text-align: center;
    
}

.table-search-result {
    position: relative;
}

.v-icon,
    .custom-icon {
        width: 18px;
    }
</style>


