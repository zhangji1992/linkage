cc.directive('industrySelector', ['industryData', '$timeout', function (industryData, $timeout) {
    return {
        restrict: 'EA',
        replace: true,
        scope: {
            res: '='
        },
        template: '<div class="wrap">' +
        '<ul class="left" > ' +
        '<li class="province-item" ng-repeat="data in dataList track by $index"> ' +
        '<input type="checkbox" ng-model="data.sel" ng-click="provinceClick(data)"> ' +
        '<span>{{data.name}}</span> ' +
        '<a href="javascript:;" class="checkBtn" ng-click="addCity($index);reserveAttr(data,false);">{{data.showChildrens?"-":"+"}}</a> ' +
        '<div class="city-item" ng-repeat="dataCity in cityCache[data.id]" ng-hide="!data.showChildrens"> ' +
        '<input type="checkbox" ng-model="dataCity.sel" ng-click="cityClick(dataCity,data)"> ' +
        '<span>{{dataCity.name}}</span> ' +
        '<a href="javascript:;"class="checkBtn" ng-click="addCountry($parent.$index,$index);reserveAttr(dataCity)">{{dataCity.showChildrens?"-":"+"}}</a> ' +
        '<div class="county-item" ng-repeat="dataDistrict in countryCache[dataCity.id]" ng-hide="!dataCity.showChildrens"> ' +
        '<input type="checkbox" ng-model="dataDistrict.sel" ng-click="countyClick(dataDistrict,dataCity,data)"> ' +
        '<span>{{dataDistrict.name}}</span> ' +
        '</div> ' +
        '</div> ' +
        '</li> ' +
        '</ul> ' +
        '<div class="left">' +
        '<div class="titleRight">' +
        '<span>已选择</span>' +
        '<a style=" float: right;" href="javascript:;" ng-click="delAll()" class="delChoice">全部删除</a> ' +
        '</div>' +
        '<ul class="choiceAll"> ' +
        '<li class="province-item" ng-repeat="data in dataList track by $index"> ' +
        '<span ng-if="data.sel">{{data.name}}</span> ' +
        '<a href="javascript:;"class="checkBtn" ng-if="data.sel" ng-click="provinceDel(data)">X</a> ' +
        '<div class="city-item" ng-repeat="dataCity in cityCache[data.id]" "> ' +
        '<span ng-if="dataCity.sel&&!data.sel">{{dataCity.name}}</span> ' +
        '<a href="javascript:;"class="checkBtn" ng-if="dataCity.sel&&!data.sel" ng-click="cityDel(dataCity)">X</a> ' +
        '<div class="county-item" ng-repeat="dataDistrict in countryCache[dataCity.id]" "> ' +
        '<span ng-if="dataDistrict.sel&&!dataCity.sel" >{{dataDistrict.name}}</span> ' +
        '<a href="javascript:;"class="checkBtn" ng-if="dataDistrict.sel&&!dataCity.sel" ng-click="dataDistrictClick(dataDistrict)">X</a> ' +
        '</div> ' +
        '</div> ' +
        '</li> ' +
        '</ul>' +
        '</div>' +
        '</div>',
        link: function ($scope, element, attrs, service) {
            $timeout(function () {
                $scope.addCity = function (provIndex) {
                    console.log($scope.dataList[provIndex])
                    if ($scope.cityCache[$scope.dataList[provIndex].id]) return
                    $scope.cityCache[$scope.dataList[provIndex].id] = $scope.dataList[provIndex].cities
                    $scope.cityCache[$scope.dataList[provIndex].id].showChildrens = true
                }
                $scope.addCountry = function (provIndex, cityIndex) {
                    console.log(provIndex, cityIndex, $scope.dataList[provIndex].cities[cityIndex])
                    if ($scope.countryCache[$scope.dataList[provIndex].cities[cityIndex].id]) return
                    $scope.countryCache[$scope.dataList[provIndex].cities[cityIndex].id] = $scope.dataList[provIndex].cities[cityIndex].counties
                    $scope.countryCache[$scope.dataList[provIndex].cities[cityIndex].id].showChildrens = true
                }
                $scope.cityCache = {}
                $scope.countryCache = {}
                //选择框点击，下级影响上级变化
                $scope.refresh = function () {
                    var ags = arguments;
                    var alen = ags.length;
                    for (var i = 0; i < alen; i++) {
                        var flag = true;
                        var j, jLen;
                        jLen = ags[i].ele1.length;
                        for (j = 0; j < jLen; j++) {
                            if (!ags[i].ele1[j].sel) {
                                flag = false;
                                ags[i].ele2 && (ags[i].ele2.sel = false);
                            }
                        }
                        ags[i].ele3 && (ags[i].ele3.sel = flag);
                    }
                }
                //选择框点击，上级影响下级变化
                $scope.selToParentSel = function (ele, flag) {
                    var i, iLen;
                    iLen = ele.length;
                    for (i = 0; i < iLen; i++) {
                        ele[i].sel = flag;
                        if (ele[i].hasOwnProperty('cities')) {
                            var j, jLen;
                            jLen = ele[i].cities.length;
                            for (j = 0; j < jLen; j++) {
                                ele[i].cities[j].sel = flag;
                                if (ele[i].cities[j].hasOwnProperty('counties')) {
                                    var k, kLen;
                                    kLen = ele[i].cities[j].counties.length;
                                    for (k = 0; k < kLen; k++) {
                                        ele[i].cities[j].counties[k].sel = flag;
                                    }
                                }
                            }
                        } else if (ele[i].hasOwnProperty('counties')) {
                            var j, jLen;
                            jLen = ele[i].counties.length;
                            for (j = 0; j < jLen; j++) {
                                ele[i].counties[j].sel = flag;
                            }
                        }
                    }
                }
                //过滤选中区域
                $scope.subMitres = function (res) {
                    var submtDats = [];
                    var i, iLen;
                    iLen = res.length;
                    for (i = 0; i < iLen; i++) {
                        if (res[i].sel) {
                            submtDats.push(res[i].id + '');
                        } else {
                            var j, jLen;
                            jLen = res[i].cities.length;
                            for (j = 0; j < jLen; j++) {
                                if (res[i].cities[j].sel) {
                                    submtDats.push(res[i].id + '-' + res[i].cities[j].id);
                                } else {
                                    var k, kLen;
                                    kLen = res[i].cities[j].counties.length;
                                    for (k = 0; k < kLen; k++) {
                                        if (res[i].cities[j].counties[k].sel) {
                                            submtDats.push(res[i].id + '-' + res[i].cities[j].id + '-' + res[i].cities[j].counties[k].id);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    return submtDats;
                }
                // 获取数据
                $scope.dataList = industryData.provinces
                $scope.res = $scope.res || [];
                //查看上次保存后的选中的值，并记忆状态
                for (var i = 0; i < $scope.dataList.length; i++) {
                    for (var j = 0; j < $scope.res.length; j++) {
                        if ($scope.dataList[i].id == $scope.res[j]) {
                            $scope.dataList[i].sel = true;
                            $scope.dataList[i].showChildrens = true;
                            $scope.selToParentSel($scope.dataList[i].cities, true);
                        } else {
                            for (var k = 0; k < $scope.dataList[i].cities.length; k++) {
                                for (var l = 0; l < $scope.res.length; l++) {
                                    if ($scope.dataList[i].cities[k].id == $scope.res[l]) {
                                        $scope.addCity($scope.dataList[i].id)
                                        $scope.cityCache[$scope.dataList[provIndex].id].sel = true;
                                        $scope.cityCache[$scope.dataList[provIndex].id].showChildrens = true;

                                        $scope.dataList[i].cities[k].sel = true;
                                        $scope.dataList[i].showChildrens = true;
                                        $scope.dataList[i].cities[k].showChildrens = true;
                                        $scope.selToParentSel($scope.dataList[i].cities[k].counties, true);
                                    } else {
                                        for (var n = 0; n < $scope.dataList[i].cities[k].counties.length; n++) {
                                            for (var m = 0; m < $scope.res.length; m++) {
                                                if ($scope.dataList[i].cities[k].counties[n].id == $scope.res[m]) {
                                                    $scope.addCountry($scope.dataList[i].id, $scope.dataList[i].cities[k].id)

                                                    $scope.dataList[i].showChildrens = true;
                                                    $scope.dataList[i].cities[k].showChildrens = true;
                                                    $scope.dataList[i].cities[k].counties[n].sel = true;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }


                $scope.res = $scope.subMitres($scope.dataList)
                //反转属性
                $scope.reserveAttr = function (ele, flag) {
                    if (flag) {
                        ele.sel = !ele.sel;
                    } else {
                        ele.showChildrens = !ele.showChildrens;
                    }
                },
                    //左侧选择框点击
                    //省级点击
                    $scope.provinceClick = function (ele) {
                        var flag = ele.sel;
                        $scope.selToParentSel(ele.cities, flag);
                        $scope.res = $scope.subMitres($scope.dataList)
                    },
                    //市级点击
                    $scope.cityClick = function (ele, ele1) {
                        var flag = ele.sel;
                        $scope.selToParentSel(ele.counties, flag);
                        $scope.refresh({
                            'ele1': ele1.cities,
                            'ele3': ele1
                        })
                        $scope.res = $scope.subMitres($scope.dataList)
                    },
                    //县级点击
                    $scope.countyClick = function (ele, ele1, ele2) {
                        $scope.refresh({
                            'ele1': ele1.counties,
                            'ele2': ele2,
                            'ele3': ele1
                        }, {
                            'ele1': ele2.cities,
                            'ele3': ele2
                        })
                        $scope.res = $scope.subMitres($scope.dataList)
                    }
                // 右侧删除
                //省级删除
                $scope.provinceDel = function (ele) {
                    ele.sel = !ele.sel;
                    $scope.selToParentSel(ele.cities, false);
                    $scope.res = $scope.subMitres($scope.dataList)
                }
                // 市级删除
                $scope.cityDel = function (ele) {
                    ele.sel = !ele.sel;
                    $scope.selToParentSel(ele.counties, false);
                    $scope.res = $scope.subMitres($scope.dataList)
                }
                //区域删除
                $scope.dataDistrictClick = function (ele) {
                    ele.sel = !ele.sel;
                    $scope.res = $scope.subMitres($scope.dataList)
                }
                //删除所有
                $scope.delAll = function () {
                    $scope.selToParentSel($scope.dataList, false);
                    $scope.res = [];
                }
                console.log(999)
            }, 0)
        }
    }
}])