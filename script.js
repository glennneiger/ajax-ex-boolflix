
function printConsolenavPages(data){

    var source = $('#template_nav_page').html();
    var template = Handlebars.compile(source);

    var context = {
        paginacorrente: data.page,
        totalepagine: data.total_pages
    };

    var html = template(context);

    $('#consol_page').html(html);
}

function prinResult(data, append_to){

    
    var source = $('#templateinfofilm').html();
    var template = Handlebars.compile(source);

    var vote_count = Math.ceil(data.vote_average / 2);
    

    console.log("stars average", vote_count);
    

    var context = {
        id: data.id,
        img: controlimgnull(data.poster_path),
        title: data.title,
        titoloorig: data.original_title,
        lingua: data.original_language,
        overview: data.overview,
        
        voto: "voto",
        voteref: "id-" + data.id
    };

    var html = template(context);

    append_to.append(html);  

    starsGener(vote_count, data.id);

    printGenres(data.id, "movie")
}

function printGeneriLis(data){
    /* VERSIONE VANILLA JS */
    var arr_generi = data.genres;
   
   /* var newDiv = document.createElement("div"); 
    
   newDiv.className = 'genere_class'; */

   /* VERSIONE HANDLEBARS */
   /* STAMPO IL TITOLO DELLA LISTA GENERATA DINAMICAMENTE */
   var source = $('#template_generi_list').html();
   var template = Handlebars.compile(source);
   var context_1 = {
                    bla : "Generi Film"
                };
    var html_1 = template(context_1);
    $('#genere_movies').append(html_1);             
    
    for (let i = 0; i < arr_generi.length; i++) {
        const name = arr_generi[i].name;

        /* var ref = document.createElement("a");
            var newContent = document.createTextNode(name);
            
            ref.appendChild(newContent);
            newDiv.appendChild(ref); */

        var context_2 = {
            nome: name,
            id_genere: arr_generi[i].id
        };

        var html_2 = template(context_2);
        $('#genere_movies').append(html_2);
        
    }

    /* $('.container').append(newDiv); */ 

}

function controlimgnull(imgurl){
    var src = "";
  
    if (imgurl === null){
      src = "img/sorry.jpg"
    }else{
      src = "https://image.tmdb.org/t/p/w342" + imgurl;
    }
    return src
}

// funzione per aggiungere le stelline  nell'html
function starsGener(score, id) {

console.log("stars generare" , score, id);

    //aggiungo le stelline piene
    for (var i = 1; i <= score; i++) {
      $(".appendstar[voteref=id-" + id + "]").append("<i class='cl-yw fas fa-star'><i>");
    }
    //aggiungo le stelline vuote
    for (var j = 1; j <= (5 - score); j++) {
      $(".appendstar[voteref=id-" + id + "]").append("<i class='fas fa-star'><i>");
    }
  
}

function printGenres(id, type){

    var genreApi = "https://api.themoviedb.org/3/"+type+"/" + id;
    var apikey = "ad43da61407cf7dd84ab0c94302e0c68";
  
    $.ajax({
  
      url: genreApi,
      method: "GET",
      data: {
        api_key: apikey,
        language: "it-IT",
      },
      success: function(data){
        console.log("GENERI");
        console.log(data.genres);
  
        var generi = data.genres;
  
        for (var i = 0; i < generi.length; i++) {
          if (i === generi.length - 1) {
            $('#' + id + ' .movie-genre').append(generi[i].name +".");
          }else{
            $('#' + id + ' .movie-genre').append(generi[i].name + ", ");
          }
  
        }
      },
      error: function(errors){
        console.log("errore chiamata genereApi", errors);
        
      }
    });
  }


function apiForGenereFilter(page, url, apiKey, query, genere_val){

    $.ajax({

        url: url,
        method: "GET",
        data: { query: query,
            language: "it-IT",
            api_key: apiKey,
            page: page }, 

        success: function(data){

            var results = data.results;
            getGenreArray(results, genere_val);
            
            
        },
        error: function(error){
            console.log("errore chiamata per tutte le altre pagine");
            
        }

    });
 

}

function getGenreArray(data, genere_val) {
     
    $('.page').remove();
    for (let j = 0; j < data.length; j++) {

        const el = data[j];
        var arr_genre = el.genre_ids;
        console.log("GETARRGENERE", genere_val, arr_genre, el);
       
        if (arr_genre.includes(Number(genere_val)) && $('.card').length < 50) {
            console.log("GETARRGENERE");
            prinResult(el,$('.wrapper'));
            
                       
        } 
    }          
    
              
}

function getDataPageNextPrev(query, pag_n, url, apiKey){

    $.ajax({
        url: url,
        method: "GET",
        data: { query: query,
                language: "it-IT",
                api_key: apiKey,
                page: pag_n },

        success: function(data){
            console.log(data);
            var results = data.results;

                        
            $('.card').remove();
            /* STAMPA CONSOL NAVIGAZIONE PAGINE */
            printConsolenavPages(data);

            /* CICLO E STAMPO ARRAI DEI RISULTATI OGGETTI */
            for (let i = 0; i < results.length; i++) {
                var el =results[i];
                
                prinResult(el, $('.wrapper'));
            }
                      
        },
        error: function(err){
            console.log("errore chiamata api");
            
        }
    });


}

function getData(pag_n,url,apiKey){

    var query = $('#query_search').val();

    $.ajax({
        url: url,
        method: "GET",
        data: { query: query,
                language: "it-IT",
                api_key: apiKey,
                page: pag_n },

        success: function(data){
            console.log(data);
            var results = data.results;
            var total_pages = data.total_pages;
            var page = data.page;
            
                        
            $('.card').remove();
            /* STAMPA CONSOL NAVIGAZIONE PAGINE */
            printConsolenavPages(data);

            /* CICLO E STAMPO ARRAI DEI RISULTATI OGGETTI */
            for (let i = 0; i < results.length; i++) {
                var el =results[i];
                prinResult(el, $('.wrapper'));
            }

            /* EVENTO CLICK PER ANDARE ALLA PAGINA 
            SUCCESSIVA DEI RISULTATI */
            $(document).on("click", "#nextpage", function(){
                
                page++;
                navPageNext(page, total_pages, url, apiKey, query);
            });
            
            /* EVENTO CLICK PER ANDARE ALLA PAGINA 
            PRECEDENTE DEI RISULTATI */
            $(document).on("click", "#prevpage", function(){

                page--;
                navPagePrev(page, url, apiKey, query);

            });

            /* FUNZIONE AZIONE CLICK SUL GNERE PER 
            FILTRO GENERE */
            $(document).on('click','.genere',function(){

                filtereGenresBtn($(this), query, total_pages, url, apiKey);
            });
                         
        },
        error: function(err){
            console.log("errore chiamata api");
            
        }
    });
}

/* FUNZIONE EVENTO CLICK PER SCORRERE LA PAGINA DEI RISULTATI */
function navPagePrev(page_counter, url, apiKey, query){
        
    /* CONTROLLO PER IL BLOCCO FUNZIONE IN BASE AL 
    NUMERO DELLE PAGINE RESTITUITE DAL JSON */
    if (page_counter > 0){

        getDataPageNextPrev(query, page_counter, url, apiKey);
        
        console.log(page_counter);
    }

}

/* FUNZIONE EVENTO CLICK PER SCORRERE LA PAGINA DEI RISULTATI */
function navPageNext(page_counter, total_pages, url, apiKey, query){
   
    /* CONTROLLO PER IL BLOCCO FUNZIONE IN BASE AL 
    NUMERO DELLE PAGINE RESTITUITE DAL JSON s*/
    if (page_counter < total_pages){
        
        console.log("ciao", total_pages, page_counter);
        getDataPageNextPrev(query, page_counter, url, apiKey)
    
    }
 
}

/* FUNZIONE EVENTO CLICK FILTRO RISULTATI PER GENERE */
function filtereGenresBtn(itemClicked, query, total_pages, url, apiKey){

        var genere_val = itemClicked.attr('id');
        var page_forapi = 1;

         console.log("total_pages", total_pages);

         $('.card').remove();
        for (let i = 0; i < total_pages; i++) {
            page_forapi++;
            apiForGenereFilter(page_forapi, url, apiKey, query,genere_val);
            
        }
        page_forapi = 0;

}

function getGenresNameApi(url, apikey){

    $.ajax({

        url: url,
        method: "GET",
        data: {
            language: "it-IT",
            api_key: apikey
        },

        success: function(data){

            console.log("generi", data.genres);
            printGeneriLis(data)
        },
        error: function(err){
            console.log("errore chiamata lista generi");
            
        }
    });
}


function init() {
    var url = "https://api.themoviedb.org/3/search/movie?&language=it-IT";
    var apiKey = "ad43da61407cf7dd84ab0c94302e0c68";
    var urlgenresmovie =  "https://api.themoviedb.org/3/genre/movie/list";

    var page_counter = 0;
    
    /* API PER RICHIESTA LISTA GENERI */
    getGenresNameApi(urlgenresmovie, apiKey)
    /* EVENTO KEYPRESS SU TASTO INVIO PER AVVIARE LA RICERCA */
    $(document).on("keypress", "#query_search", function(event){

        if (event.which === 13) {

            /* CONTATORE PER INVIARE IL PARAMETRO PAGINA ALLA
            RICHIESTA AJAX CONTENUTA NELLA FUNZIONE */
            page_counter = 1;

            getData (page_counter, url, apiKey);
        }
    });

    

    
    
}

$(document).ready(init);

