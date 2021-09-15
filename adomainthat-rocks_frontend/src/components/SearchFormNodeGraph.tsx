import {useEffect, useState} from 'react';
import {Form, Button, ListGroup, Spinner} from 'react-bootstrap';
import {myApolloClient} from '../App';
import {gql} from '@apollo/client';
import './SearchFormNodeGraph.css';

const SearchFormNodeGraph = (props: any) => {
    let lastValue = '';
    const [suggestionLoading, setSuggestionLoading] = useState(false)
    const [searchValueDict, setSearchValueDict] = useState(new Map<string, []>());
    const [isQueryingAPI, setIsQueryingAPI] = useState(new Map<string, boolean>());
    const [resultsObtained, setResultsObtained] = useState(new Set());
    const [searchValueNodeName, setSearchValueNodeName] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [lastChangeTimeoutTimerId, setLastChangeTimeoutTimerId] = useState(0);
    const [formInputs, setFormInputs] = useState({
        input: {nodeId: '', min: 1, max: 2},
        errors: {nodeId: '', min: '', max: ''},
        isFormValid: false,
        isValidatedAtLeastOnce: false
    });

    const onSubmitHandler = (event: any) => {
        event.preventDefault();
        if (validate()) {
            props.onSearchHandler(formInputs.input.nodeId, formInputs.input.min, formInputs.input.max);
        }
    };

    useEffect(() => {
            if (formInputs.isValidatedAtLeastOnce) {
                validate();
            }
        }, [formInputs.input.nodeId, formInputs.input.min, formInputs.input.max, searchValueNodeName]
    );

    const validate = () => {
        let input = formInputs.input;
        let errors = {
            min: '',
            max: '',
            nodeId: ''
        };
        let isValid = true;

        //Name is required - check if it is empty
        if ((!input["nodeId"] || input["nodeId"] === '') && searchValueNodeName !== '') {
            isValid = false;
            errors["nodeId"] = "Choose a node name from the list";
        }

        if ((!input["nodeId"] || input["nodeId"]) && searchValueNodeName === '') {
            isValid = false;
            errors["nodeId"] = "Enter a name or a title to get a list of possible nodes"
        }

        // Minimum depth validation checks
        if (!input["min"]) {
            isValid = false;
            errors["min"] = "Minimum depth is required";
        }
        if ((input["min"] < 1 && !input["max"]) || (input["min"] < 1 && input["min"] <= input["max"])) {
            isValid = false;
            errors["min"] = "Minimum depth has to be greater or equal to 1";
        }
        if (input["min"] < 1 && input["min"] > input["max"]) {
            isValid = false;
            errors["min"] = "Minimum depth has to be greater or equal to maximum depth and it has to be greater or equal to 1";
        }
        if (input["min"] > 1 && input["min"] > input["max"]) {
            isValid = false;
            errors["min"] = "Minimum depth has to be smaller or equal to maximum depth";
        }

        //Maximum depth checks
        if (!input["max"]) {
            isValid = false;
            errors["max"] = "Maximum depth is required";
        }
        if (input["max"] >= 1 && input["max"] < input["min"]) {
            isValid = false;
            errors["max"] = "Maximum depth has to be greater or equal to minimum depth";
        }
        if (input["max"] < 1 && input["max"] >= input["min"]) {
            isValid = false;
            errors["max"] = "Maximum depth has to be greater or equal to 1";
        }
        if (input["max"] < 1 && input["max"] < input["min"]) {
            isValid = false;
            errors["max"] = "Maximum depth has to be greater or equal to minimum depth and it has to be greater or equal to 1";
        }

        setFormInputs((prevState) => ({
            ...prevState,
            errors: errors,
            isFormValid: isValid,
            isValidatedAtLeastOnce: true
        }));
        return isValid;
    };

    const searchQueryBuilder = (searchV: string, num: string) => {
        return gql`
            query {
                nodesID${num}(name: "${searchV}") {
                    ... on SuggestedNode {
                        _id
                        graph_name
                        the_type
                    }
                }
            }
        `;
    };

    const queryAPIforSuggestions = async (searchVal: string) => {
        // const lowerSearchVal = searchVal
        //
        // isQueryingAPI.set(lowerSearchVal, true);
        // setIsQueryingAPI(isQueryingAPI);
        //
        // const result5: any = await myApolloClient.query({ query: searchQueryBuilder(lowerSearchVal, "5") });
        //
        // searchValueDict.set(lowerSearchVal, result5.data.nodesID5);
        // setSearchValueDict(searchValueDict);
        //
        // resultsObtained.add(lowerSearchVal);
        // setResultsObtained(resultsObtained);
        // filterObtainedResults();
        //
        // const result3: any = await myApolloClient.query({ query: searchQueryBuilder(lowerSearchVal, "3") });
        // const result35: any = [...result3.data.nodesID3, ...result5.data.nodesID5]
        //
        // searchValueDict.set(lowerSearchVal, result35);
        // setSearchValueDict(searchValueDict);
        // filterObtainedResults();
        //
        // const result2: any = await myApolloClient.query({ query: searchQueryBuilder(searchVal, "2") });
        // const result235: any = [...result2.data.nodesID2, ...result35]
        //
        // searchValueDict.set(lowerSearchVal, result235);
        // setSearchValueDict(searchValueDict);
        //
        // isQueryingAPI.set(lowerSearchVal, false);
        // setIsQueryingAPI(isQueryingAPI);
        // filterObtainedResults();

        const lowerSearchVal = searchVal

        isQueryingAPI.set(lowerSearchVal, true);
        setIsQueryingAPI(isQueryingAPI);
        setSuggestionLoading(true)
        const result2: any = await myApolloClient.query({query: searchQueryBuilder(searchVal, "2")});
        setSuggestionLoading(false)
        searchValueDict.set(lowerSearchVal, result2.data.nodesID2);
        setSearchValueDict(searchValueDict);

        resultsObtained.add(lowerSearchVal);
        setResultsObtained(resultsObtained);

        isQueryingAPI.set(lowerSearchVal, false);
        setIsQueryingAPI(isQueryingAPI);
        filterObtainedResults();
    };

    const filterObtainedResults = () => {
        let flag_done = false;
        for (let i = 0; i < lastValue.length; i++) {
            for (let item of resultsObtained) {
                if (item === lastValue.substring(0, lastValue.length - i)) {
                    const suggest: any = searchValueDict.get(item);
                    setSuggestions(suggest);
                    flag_done = true;
                    break;
                }
            }
            if (flag_done) break;
        }
        if (!flag_done) setSuggestions([]);
    }

    const focusReturnedHandler = (event: any) => {
        event.preventDefault();
        clearTimeout(lastChangeTimeoutTimerId);
        const argVal: string = event.target.value
        lastValue = argVal;
        suggestOrQuery(argVal);
    }

    const updateSearchValueNodeName = (event: any) => {
        event.preventDefault();
        setFormInputs((prevState) => ({
            ...prevState,
            input: {
                ...prevState.input,
                nodeId: ''
            }
        }));
        clearTimeout(lastChangeTimeoutTimerId);
        const argVal: string = event.target.value
        setSearchValueNodeName(argVal);
        lastValue = argVal;
        suggestOrQuery(argVal);
    };

    const suggestOrQuery = (argEventVal: string) => {
        if (argEventVal.length > 4 && !resultsObtained.has(argEventVal) && !isQueryingAPI.has(argEventVal)) {
            const newTimeoutTimerId: any = setTimeout(function () {
                queryAPIforSuggestions(argEventVal);
            }, 750);
            setLastChangeTimeoutTimerId(newTimeoutTimerId)
        } else if (argEventVal.length > 4 && resultsObtained.has(argEventVal)) {
            const suggest: any = searchValueDict.get(argEventVal);
            setSuggestions(suggest);
        }
    }

    const onSuggestionSelectionHandler = (suggestion: any) => {
        setFormInputs((prevState) => ({
            ...prevState,
            input: {
                ...prevState.input,
                nodeId: suggestion._id
            }
        }));
        setSearchValueNodeName(suggestion.graph_name);
    };

    const updateMinDepthValue = (event: any) => {
        event.preventDefault();
        setFormInputs((prevState) => ({
            ...prevState,
            input: {
                ...prevState.input,
                [event.target.name]: parseInt(event.target.value) // to do refactor to outer function call
            },
        }));
    };

    const updateMaxDepthValue = (event: any) => {
        event.preventDefault();
        setFormInputs((prevState) => ({
            ...prevState,
            input: {
                ...prevState.input,
                [event.target.name]: parseInt(event.target.value) // to do refactor to outer function call
            },
        }));
    };

    return (
        <Form onSubmit={onSubmitHandler} className="searchForm">
            <Form.Group className="autocomplete-container"
                        controlId="search"
                        onBlur={() => {
                            setTimeout(() => {
                                setSuggestions([])
                            }, 200);
                        }}>
                <Form.Label className="text-muted">Node name or title</Form.Label>
                <div className="autocomplete-input">
                    <Form.Control type="text"
                                  name="nodeId"
                                  placeholder="Enter a name or a title"
                                  value={searchValueNodeName}
                                  onChange={updateSearchValueNodeName}
                                  isInvalid={formInputs.errors.nodeId !== ''}
                                  isValid={formInputs.isValidatedAtLeastOnce && formInputs.input.nodeId !== ''}
                                  onFocus={focusReturnedHandler}
                    />
                    <Form.Control.Feedback type="invalid">
                        {formInputs.errors.nodeId}
                    </Form.Control.Feedback>

                    {suggestionLoading && <Spinner className="suggestion-spinner"
                                                   as="span"
                                                   animation="border"
                                                   size="sm"
                                                   role="status"
                                                   aria-hidden="true"
                                          />
                    }
                </div>

                <ListGroup className="suggestionList">
                    {suggestions && suggestions.length > 0 && suggestions.map((this_suggestion: any, i) =>
                        <ListGroup.Item key={i}
                                        onClick={() => onSuggestionSelectionHandler(this_suggestion)}
                        >
                        {this_suggestion.the_type[0].toUpperCase() + this_suggestion.the_type.slice(1) + ": " + this_suggestion.graph_name}
                        </ListGroup.Item>
                    )}
                </ListGroup>
            </Form.Group>

            <Form.Group>
                <Form.Label className="text-muted">Minimum depth</Form.Label>
                <Form.Control type="number"
                              name="min"
                              placeholder="Set minimum depth, e.g: 1"
                              value={formInputs.input.min}
                              isInvalid={formInputs.errors.min !== ''}
                              isValid={formInputs.isValidatedAtLeastOnce && formInputs.errors.min === ''}
                              onChange={updateMinDepthValue}
                />
                <Form.Control.Feedback type="invalid">
                    {formInputs.errors.min}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
                <Form.Label className="text-muted">Maximum depth</Form.Label>
                <Form.Control type="number"
                              name="max"
                              placeholder="Set maximum depth, e.g: 2"
                              value={formInputs.input.max}
                              onChange={updateMaxDepthValue}
                              isInvalid={formInputs.errors.max !== ''}
                              isValid={formInputs.isValidatedAtLeastOnce && formInputs.errors.max === ''}
                />
                <Form.Control.Feedback type="invalid">
                    {formInputs.errors.max}
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
                <Button className="searchButton"
                        variant="dark"
                        type="submit"
                        disabled={formInputs.isValidatedAtLeastOnce && (!formInputs.isFormValid || props.isLoadingGraph)}>
                        {props.isLoadingGraph && <Spinner as="span"
                                                          animation="border"
                                                          size="sm"
                                                          role="status"
                                                          aria-hidden="true"
                                                 />
                        }
                    <span> Search</span>
                </Button>
            </Form.Group>
        </Form>
    );
};

export default SearchFormNodeGraph;

