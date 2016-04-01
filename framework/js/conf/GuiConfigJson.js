/*
 * This file is used only for client compoenent testing. This file contains hardcoded PC configuration data 
 */
define(function() {
	return {
		   "config":{
			      "PCs":{
			         "PC":[
			            {
			               "name":"pc1",
			               "ModuleOrder":{
			                  "Module":[
			                     "common-V807.18.01_02"
			                  ]
			               }
			            }
			         ]
			      },
			      "FCOs":{
			         "FCO":[
			            {
			               "name":"Subscriber",
			               "Operations":{
			                  "Operation":[
			                     {
			                        "name":"Search",
			                        "isDisplay":"true",
			                        "Views":{
			                           "View":[
			                              {
			                                 "ViewName":"FullDetailsView",
			                                 "Modules":{
			                                    "Module":[
			                                       {
			                                          "name":"common-V807.18.01_02",
			                                          "BackboneView":"CommonSearchView"
			                                       }
			                                    ]
			                                 }
			                              },
			                              {
			                                 "ViewName":"ReadOnlyView",
			                                 "Modules":{
			                                    "Module":[
			                                       {
			                                          "ModuleName":"common-V807.18.01_02",
			                                          "BackboneView":"CommonSearchView"
			                                       }
			                                    ]
			                                 }
			                              }
			                           ]
			                        }
			                     }
			                  ]
			               }
			            }
			         ]
			      }
			   }
			};
});
