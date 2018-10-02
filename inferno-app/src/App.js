import {
    Component
} from 'inferno';
import './registerServiceWorker';
import './App.css';
var algoliasearch = require('algoliasearch');
var client = algoliasearch('N2K83PZDUD', '35b4d2caced22b7b1d894cc2701eae18');
var index = client.initIndex('inferno');


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
        index.setSettings({
            'searchableAttributes': [
            'name', 'category'
          ],
            replicas: [
                "ascendentRanking",
                "decendentRanking"
            ],
            'attributesForFaceting': ['category'],
            'customRanking': [this.sortOrder + '(rank)']
        }, {
            forwardToReplicas: true
        }, function (err, content) {
            console.log(content);
        });
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
        if (this.sortOrder === "desc") {
            this.sortOrder = "asc";
        } else {
            this.sortOrder = "desc"
        }
        let sorting = this.sortOrder + '(rank)'
        index.setSettings({
            'customRanking': [sorting]
        }, {
            forwardToReplicas: true
        })
    }


    search = () => {
        if (this.state.category !== "" && this.state.category !== "All") {
            console.log("searching for " + this.state.value + " in " + this.state.category + " category");
            index.search(this.state.value, {
                filters: 'category:' + this.state.category
            }, (err, content) => {
                if (content) {
                    console.log(content.hits);
                    this.setState({
                        displayedItems: content.hits
                    });
                } else {
                    console.log("no item found")
                }

            });
        } else {
            console.log("searching for " + this.state.value + " in all categories");
            index.search(this.state.value, (err, content) => {
                if (content) {
                    console.log(content.hits);
                    this.setState({
                        displayedItems: content.hits
                    });
                } else {
                    console.log("no item found")
                }
            });
        }

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
                value = {
                    this.state.value
                }
                placeholder = "books?"
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
                        } < /div > < /form > < /
                        section >
                    );
                }
            };

            export default App;
