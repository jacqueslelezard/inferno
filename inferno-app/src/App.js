import {
    Component
} from 'inferno';
import './registerServiceWorker';
import './App.css';
var algoliasearch = require('algoliasearch');
var client = algoliasearch('N2K83PZDUD', '35b4d2caced22b7b1d894cc2701eae18');
var indexAsc = client.initIndex('ascendentRanking');
var indexDesc = client.initIndex('descendentRanking');
var searchIndex = indexAsc;

class App extends Component {
    render() {
        return ( < div className = "App" >
            <
            header className = "App-header" > <
            p >
            Looking
            for a new app ? <
            /p><
            h1 >
            You will find it here <
            /h1> <
            video src = "https://staging.coverr.co/s3/mp4/Indian%20Tea.mp4"
            loop autoplay > < /video>   < /
            header > <
            NameForm > < /NameForm>   < /
            div >
        );
    };
};

class NameForm extends App {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            category: '',
            displayedItems: [],
            categoriesList: ["All", "Books", "Business", "Games", "Navigation", "Newsstand", "Social Networking", "Medical", "News", "Catalogs", "Education", "Sports", "Music", "Photo & Video", "Travel", "Finance", "Productivity", "Entertainment"],
            sortOrder: 'asc',
        };
        this.handleChange = this.handleChange.bind(this);

    }
    handleChange = (event) => {
        this.setState({
            value: event.target.value
        });
        this.search();
    }
    handleChangeSelect = (event) => {
        this.setState({
            category: event.target.value
        });
        this.search();
    }
    reverseSorting = () => {
        console.log(searchIndex);
        if (this.sortOrder === "desc") {
            searchIndex = indexAsc;
            this.sortOrder = "asc";
        } else {
            searchIndex = indexDesc;
            this.sortOrder = "desc";
        }
        this.search();
    }

    search = () => {
        //TODO some refactoring
        if (this.state.category !== "" && this.state.category !== "All") {
            console.log("searching for " + this.state.value + " in " + this.state.category + " category");
            searchIndex.search(this.state.value, {
                filters: 'category:' + this.state.category
            }, (err, content) => {
                if (content.hits.length > 0) {
                    this.setState({
                        displayedItems: content.hits
                    });
                    document.getElementById("fallback").style.opacity = 0;
                } else {
                    console.log("no item found" + err);
                    this.setState({
                        displayedItems: []
                    });
                    document.getElementById("fallback").style.opacity = 0.3;
                }

            });
        } else {
            console.log("searching for " + this.state.value + " in all categories");
            searchIndex.search(this.state.value, (err, content) => {
                if (content.hits.length > 0) {
                    this.setState({
                        displayedItems: content.hits
                    });
                    document.getElementById("fallback").style.opacity = 0;
                } else {
                    console.log("no item found" + err);
                    this.setState({
                        displayedItems: []
                    });
                    document.getElementById("fallback").style.opacity = 0.3;
                }
            });
        }

    }

    componentDidMount() {
        //set focus on input on page opening
        document.getElementById("searchBox").focus();
    }

    render() {
            return ( < section class = "searchArea" > < form onSubmit = {
                    this.handleSubmit
                } >
                <
                label >
                Search
                for: < /label> <
                input type = "text"
                id = "searchBox"
                value = {
                    this.state.value
                }
                placeholder = "some books?"
                onInput = {
                    this.handleChange
                }
                />   <
                label
                for = "title" > Filter by: < /label>

                <
                select id = "category"
                name = "category"
                onInput = {
                    this.handleChangeSelect
                } > {
                    this.state.categoriesList.map((cat) => < option value = {
                            cat
                        } > {
                            cat
                        } < /option>)}</select > < a class = "sort-button"
                        onClick = {
                            this.reverseSorting
                        } > Reverse order < /a> <
                        div class = "store" > {
                            this.state.displayedItems.map(function (item) {
                                item.bgimage = "background-image:url(" + "https://picsum.photos/400/400/?image=" + item.rank + ")"
                                return <div class = "item"
                                onClick = {
                                    function () {
                                        window.open(item.link)
                                    }
                                }
                                style = {
                                    item.bgimage
                                } > < h2 > {
                                    item.name
                                } < /h2> < /div >
                            })
                        } < span id = "fallback" > No item(yet!) < /span> < /div > < /form > < /
                        section >

                    );
                }
            };

            export default App;
