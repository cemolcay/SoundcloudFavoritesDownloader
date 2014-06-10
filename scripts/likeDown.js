(function ($){    
    var loginView = Backbone.View.extend ({                
        initialize : function () {
            _.bindAll(this,"render");
            this.render ();
        },
        
        render : function () {
            $("#app").html (_.template ($("#app-login").html(), {}));
            

            $("#btnLogin").click (function (){
                SC.initialize ({client_id : "5632af4389c6f766ffd1f46b38160853"});
                
                var url = "http://api.soundcloud.com/resolve.json?url=https://soundcloud.com/" +
                       $("#txtUserName").val()+
                       "&client_id=5632af4389c6f766ffd1f46b38160853";
                
                $.ajax ({
                    type : "GET",
                    dataType : "jsonp",
                    url : url
                }).done (function (data) {
                    app.navigate ("user/" + data.id, {trigger : true});
                });

//                $.get ("http://api.soundcloud.com/resolve.json?url=https://soundcloud.com/" +
//                       $("#txtUserName").val()+
//                       "&client_id=5632af4389c6f766ffd1f46b38160853", function (data) {
//                           app.navigate ("user/" + data.id, {trigger : true});
//                });
            });
        }   
    });
        
    var appView = Backbone.View.extend ({        
        initialize : function () {
            _.bindAll (this, "render");
            this.render ();
        },

        render : function () {
            SC.get ("/users/" + this.id + "/favorites", function (likes) {
                $("#app").html (_.template ($("#app-list").html(), {likes : likes}));
                console.log (likes);
                $("button#play").click (function (e) {
                    var trackId = e.currentTarget.attributes[1].value;                     
                    play (trackId);
                });
                
                $("button#download").click (function (e) {
                    var trackId = e.currentTarget.attributes[1].value;                     
                    download (trackId);
                });
            });
        }
    });
    
    var router = Backbone.Router.extend ({
        routes : {
            "" : "login",
            "user/:id" : "app"
        },
        
        login : function () {
            var login = new loginView ();
        },
        
        app : function (id) {
            var list = new appView ({id : id});
        }
    });
    
    var app;
    $(document).ready (function () {
        app = new router ();
        Backbone.history.start ();
    });
    
    function play(trackId) {
         SC.stream ("/tracks/" + trackId, function (sound) {
            console.log (sound);
            soundManager.stopAll ();
            sound.play ();
        });
    }
    
    function download (trackId) {
         SC.stream ("/tracks/" + trackId, function (sound) {
            var url = sound.url;
            
            var save = document.createElement('a');
            save.href = url;
            save.target = '_blank';
            save.download = sound.title || 'unknown';

            var event = document.createEvent('Event');
            event.initEvent('click', true, true);
            save.dispatchEvent(event);
            (window.URL || window.webkitURL).revokeObjectURL(save.href);
         });
    }
    
})(jQuery);