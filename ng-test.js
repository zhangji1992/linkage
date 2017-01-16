cc.directive('industrySelector', ['industryData', '$timeout', function (industryData, $timeout) {
    return {
        restrict: 'EA',
        replace: true,
        scope: {
            res: '='
        },
        template: '<div class="wrap">' +
        '<ul class="left"> ' +
        '<li class="province-item" ng-repeat="data in dataList track by $index"> ' +
        '<input type="checkbox" ng-model="data.sel" ng-click="topClick(data)"> ' +
        '<span>{{data.name}}</span> ' +
        '<a href="javascript:;" class="checkBtn" ng-click="addSub($index);reserveAttr(data,false);">{{data.showChildren?"-":"+"}}</a> ' +
        '<div class="city-item" ng-repeat="dataSub in subCache[data.id]" ng-hide="!data.showChildren"> ' +
        '<input type="checkbox" ng-model="dataSub.sel" ng-click="subClick(dataSub,data)"> ' +
        '<span>{{dataSub.name}}</span> ' +
        // '<a href="javascript:;" class="checkBtn" ng-click="addCountry($parent.$index,$index);reserveAttr(dataTop)">{{dataTop.showChildren?"-":"+"}}</a> ' +
        // '<div class="county-item" ng-repeat="dataDistrict in countryCache[dataTop.id]" ng-hide="!dataTop.showChildren"> ' +
        // '<input type="checkbox" ng-model="dataDistrict.sel" ng-click="countyClick(dataDistrict,dataTop,data)"> ' +
        // '<span>{{dataDistrict.name}}</span> ' +
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
        '<a href="javascript:;"class="checkBtn" ng-if="data.sel" ng-click="topDel(data)">X</a> ' +
        '<div class="city-item" ng-repeat="dataSub in subCache[data.id]" "> ' +
        '<span ng-if="dataSub.sel&&!data.sel">{{dataSub.name}}</span> ' +
        '<a href="javascript:;"class="checkBtn" ng-if="dataSub.sel&&!data.sel" ng-click="subDel(dataSub)">X</a> ' +
        //'<div class="county-item" ng-repeat="dataDistrict in countryCache[dataTop.id]" "> ' +
        //'<span ng-if="dataDistrict.sel&&!dataTop.sel" >{{dataDistrict.name}}</span> ' +
        //'<a href="javascript:;"class="checkBtn" ng-if="dataDistrict.sel&&!dataTop.sel" ng-click="dataDistrictClick(dataDistrict)">X</a> ' +
        '</div> ' +
        '</div> ' +
        '</li> ' +
        '</ul>' +
        '</div>' +
        '</div>',
        link: function ($scope, element, attrs, service) {
            $timeout(function () {
                $scope.addSub = function (provIndex) {
                    console.log($scope.dataList[provIndex])
                    if ($scope.subCache[$scope.dataList[provIndex].id]) return
                    $scope.subCache[$scope.dataList[provIndex].id] = $scope.dataList[provIndex].cities
                    $scope.subCache[$scope.dataList[provIndex].id].showChildren = true
                }
                //$scope.addCountry = function (provIndex, cityIndex) {
                //    console.log(provIndex, cityIndex, $scope.dataList[provIndex].cities[cityIndex])
                //   if ($scope.countryCache[$scope.dataList[provIndex].cities[cityIndex].id]) return
                //    $scope.countryCache[$scope.dataList[provIndex].cities[cityIndex].id] = $scope.dataList[provIndex].cities[cityIndex].counties
                //    $scope.countryCache[$scope.dataList[provIndex].cities[cityIndex].id].showChildren = true
                //}
                $scope.subCache = {}
                //$scope.countryCache = {}

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
                        if (ele[i].hasOwnProperty('sub_category')) {
                            var j, jLen;
                            jLen = ele[i].sub_category.length;
                            for (j = 0; j < jLen; j++) {
                                ele[i].cities[j].sel = flag;
                                //if (ele[i].cities[j].hasOwnProperty('counties')) {
                                //    var k, kLen;
                                //   kLen = ele[i].cities[j].counties.length;
                                //    for (k = 0; k < kLen; k++) {
                                //        ele[i].cities[j].counties[k].sel = flag;
                                //    }
                                //}
                            }
                        }
                        // else if (ele[i].hasOwnProperty('counties')) {
                        //               var j, jLen;
                        //               jLen = ele[i].counties.length;
                        //               for (j = 0; j < jLen; j++) {
                        //                   ele[i].counties[j].sel = flag;
                        //               }
                        //            }
                        //        }
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
                                    if (res[i].sub_category[j].sel) {
                                        submtDats.push(res[i].id + '-' + res[i].sub_category[j].id);
                                    }
                                    //else {
                                    //    var k, kLen;
                                    //    kLen = res[i].cities[j].counties.length;
                                    //    for (k = 0; k < kLen; k++) {
                                    //        if (res[i].cities[j].counties[k].sel) {
                                    //            submtDats.push(res[i].id + '-' + res[i].cities[j].id + '-' + res[i].cities[j].counties[k].id);
                                    //        }
                                    //    }
                                    //}
                                }
                            }
                        }
                        return submtDats;
                    }

                    // 获取数据
                    $scope.dataList = industryData.top_category;
                    $scope.res = $scope.res || [];
                    //查看上次保存后的选中的值，并记忆状态
                    for (var i = 0; i < $scope.dataList.length; i++) {
                        for (var j = 0; j < $scope.res.length; j++) {
                            if ($scope.dataList[i].id == $scope.res[j]) {
                                $scope.dataList[i].sel = true;
                                $scope.dataList[i].showChildren = true;
                                $scope.selToParentSel($scope.dataList[i].sub_category, true);
                            } else {
                                for (var k = 0; k < $scope.dataList[i].sub_category.length; k++) {
                                    for (var l = 0; l < $scope.res.length; l++) {
                                        if ($scope.dataList[i].sub_category[k].id == $scope.res[l]) {
                                            $scope.addSub($scope.dataList[i].id)
                                            $scope.topCache[$scope.dataList[provIndex].id].sel = true;
                                            $scope.topCache[$scope.dataList[provIndex].id].showChildren = true;

                                            $scope.dataList[i].sub_category[k].sel = true;
                                            $scope.dataList[i].showChildren = true;
                                            $scope.dataList[i].sub_category[k].showChildren = true;
                                            //$scope.selToParentSel($scope.dataList[i].cities[k].counties, true);
                                        }
                                        //else {
                                        //for (var n = 0; n < $scope.dataList[i].sub_category[k].counties.length; n++) {
                                        //    for (var m = 0; m < $scope.res.length; m++) {
                                        //        if ($scope.dataList[i].cities[k].counties[n].id == $scope.res[m]) {
                                        //            $scope.addCountry($scope.dataList[i].id, $scope.dataList[i].cities[k].id)

                                        //            $scope.dataList[i].showChildren = true;
                                        //           $scope.dataList[i].cities[k].showChildren = true;
                                        //            $scope.dataList[i].cities[k].counties[n].sel = true;
                                        //       }
                                        //   }
                                        //}
                                        //}
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
                            ele.showChildren = !ele.showChildren;
                        }
                    },
                        //左侧选择框点击
                        //top点击
                        $scope.topClick = function (ele) {
                            var flag = ele.sel;
                            $scope.selToParentSel(ele.sub_category, flag);
                            $scope.res = $scope.subMitres($scope.dataList)
                        },
                        //sub点击
                        $scope.subClick = function (ele, ele1) {
                            var flag = ele.sel;
                            //$scope.selToParentSel(ele.counties, flag);
                            $scope.refresh({
                                'ele1': ele1.sub_category,
                                'ele3': ele1
                            })
                            $scope.res = $scope.subMitres($scope.dataList)
                        },
                        //县级点击
                        //$scope.countyClick = function (ele, ele1, ele2) {
                        //    $scope.refresh({
                        //        'ele1': ele1.counties,
                        //        'ele2': ele2,
                        //        'ele3': ele1
                        //    }, {
                        //        'ele1': ele2.cities,
                        //        'ele3': ele2
                        //   })
                        //    $scope.res = $scope.subMitres($scope.dataList)
                        //}
                        // 右侧删除
                        //省级删除
                        $scope.topDel = function (ele) {
                            ele.sel = !ele.sel;
                            $scope.selToParentSel(ele.sub_category, false);
                            $scope.res = $scope.subMitres($scope.dataList)
                        }
                    // 市级删除
                    $scope.subDel = function (ele) {
                        ele.sel = !ele.sel;
                        $scope.selToParentSel(ele.counties, false);
                        $scope.res = $scope.subMitres($scope.dataList)
                    }
                    //区域删除
                    //$scope.dataDistrictClick = function (ele) {
                    //    ele.sel = !ele.sel;
                    //    $scope.res = $scope.subMitres($scope.dataList)
                    //}
                    //删除所有
                    $scope.delAll = function () {
                        $scope.selToParentSel($scope.dataList, false);
                        $scope.res = [];
                    }
                    console.log(999)
                }, 0
                )
        }
    }
}])