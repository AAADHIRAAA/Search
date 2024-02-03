"use client";
import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useEffect, useMemo, useRef, useState} from "react";
import {useSortBy, useTable} from "react-table";
import {BiChevronDown, BiChevronUp, BiSearch,BiX} from "react-icons/bi";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from 'axios';

export default function Home() {

    const scrollRef = useRef(null);

    const [fetchedData, setFetchedData] = useState();
    const [fullData, setFullData] = useState([]); // Store all the data
    const [visibleData, setVisibleData] = useState([]); // Data currently visible in the table
    const [searchQuery, setSearchQuery] = useState('');
    const [filterData, setFilterData] = useState([]);
    const [hasMore, setHasMore] = useState(true); // Whether more data is available
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);


    useEffect(() => {
        fetchData();
    }, []);


    const columns = useMemo(
        () => [
            {
                Header: "S.No",
                accessor: (row, index) => index + 1, // Automatically generate serial number
            },
            {
                Header: "Book Title",
                accessor: "title",
            },
            {
                Header: "ISBN",
                accessor: "isbn",
            },
            {
                Header: "Language",
                accessor: "language",
            },

            {
                Header: "Publisher",
                accessor: "publisher",
            },
            {
                Header: "Author/Editor Name",
                accessor: "author_editor",
            },
            {
                Header: "Date",
                accessor: (row) => {
                    const fullDate = row.Date;
                    if (fullDate) {

                        const year = new Date(fullDate).getFullYear();
                        return year;
                    }
                    return "";
                }
            },

        ],
        []
    );

    const fetchData = async () => {

        try {
            console.log("call", page)

            const response = await fetch(
                `http://localhost:8000/books/viewbooks?page=${page}`
            );
            if (!response.ok) {
                console.error(`HTTP error! Status: ${response.status}`);
            }

            const fetchedDatum = await response.json();
            setFetchedData(fetchedDatum);

        } catch (error) {
            setPage(prevState=>prevState);
            console.error("Error fetching data:", error.message);
        }
    };

    const fetchMore = () =>{
        console.log("fetch more")
        fetchData().then();
    }

    useEffect(() => {
        if (fetchedData) {
            setFullData(prevFullData => {
                const combinedData = [...prevFullData, ...fetchedData.data];
                return Array.from(new Set(combinedData.map(JSON.stringify))).map(JSON.parse);
            });
            setHasMore(fetchedData.currentPage < fetchedData.totalPages);
            setPage(fetchedData.currentPage+1);
        }
    }, [fetchedData]);

    // const filteredData = (fullData, searchQuery) => {
    //     return fullData.filter((item) => item.isbn.includes(searchQuery));
    // }

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable(
        {columns, data: (visibleData.length !== 0) ? visibleData : fullData},
        useSortBy
    );
    const scrollToBottom = () => {
        const element = scrollRef.current;
        if (element) {
            element.scrollTo({
                top: element.scrollHeight,
                behavior: "smooth",
            });
        }
    };
    const scrollToUp = () => {
        const element = scrollRef.current;
        if (element) {
            element.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        }

    };

    const handleSearchClick = () => {
        axios.get(`http://localhost:8000/books/find/${searchQuery}`)
                .then(response => {
                console.log(response.data);
                const fetchedData = response.data;
                setVisibleData(fetchedData ? [fetchedData] : []);
                // setFilterData(response.data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

        // const result = filteredData(fullData, searchQuery);
        
    };

    const handleClearClick = () => {
        setSearchQuery('');
        setVisibleData([]);  // Reset filterData when clearing the search
    };

    const totalbooks = async()=>{
        try{

            const response = await fetch('http://localhost:8000/books/count');
            if (!response.ok) {
                console.error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setCount(data);
            console.log(data);
        }
        catch(error){
            console.error("Error fetching Data",error);    
        }
    }

    useEffect(()=>{
       
        totalbooks();
    },[])


    const handleScroll = () => {
        const element = scrollRef.current;
        console.log("elecmet");
        // Check if the scroll position is near the bottom
        if (
            (element.scrollHeight - element.scrollTop).toFixed(0) - 5 <
            element.clientHeight &&
            hasMore
        ) {
            fetchMore();
        }
    };

    useEffect(() => {
        const element = scrollRef.current;

        if (element) {

            element.addEventListener("scroll", handleScroll);

            return () => {
                element.removeEventListener("scroll", handleScroll);
            };
        }
    }); // Add dependencies as needed

    return (
        <>
            <div style={{marginTop: "50px"}} ref={scrollRef} className={"h-[90vh] overflow-x-auto"}>
                <div className="container mx-auto">

                    <div className="mb-4 w-50 mx-auto input-group">

                        <input
                            type="text"
                            placeholder="Enter ISBN"
                            className="form-control mx-auto w-50"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button
                            className="btn btn-primary"
                          onClick={handleSearchClick}
                        >
                           <BiSearch/>
                        </button>
                        {searchQuery && (
                            <button
                                className="btn btn-secondary"
                                onClick={handleClearClick}
                            >
                                <BiX/>
                            </button>
                        )}
                    </div>

                    <div className=" " >
                        <table
                            {...getTableProps()}
                            className="table table-bordered table-hover"
                            style={{maxWidth: "100%"}}

                        >
                            <thead className={"sticky top-0"}>
                            {headerGroups.map((headerGroup, index) => (
                                <tr key={index} {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map((column, index) => (
                                        <th
                                            key={index}
                                            {...column.getHeaderProps(
                                                column.getSortByToggleProps()
                                            )}
                                            className="px-2 py-2 text-sm sm:text-base bg-primary text-white"
                                        >
                                            {column.render("Header")}
                                            {column.isSorted && (
                                                <span>{column.isSortedDesc ? " ⬇️ " : " ⬆️ "}</span>
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                            </thead>
                            <tbody {...getTableBodyProps()}>
                            {rows.map((row, rowIndex) => {
                                prepareRow(row);
                                return (
                                    <tr key={rowIndex} {...row.getRowProps()}>
                                        {row.cells.map((cell, index) => {
                                            return (
                                                <td
                                                    key={index}
                                                    {...cell.getCellProps()}
                                                    className="px-3 py-2 text-sm sm:text-base"
                                                >
                                                    {cell.render("Cell")}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                            </tbody>

                        </table>
                    </div>
                    <button
                        onClick={scrollToBottom}
                        className="btn btn-secondary fixed bottom-10 right-2"
                    >
                        <BiChevronDown className='{"h-5 w-5"}'/>

                    </button>
                    <button
                        onClick={scrollToUp}
                        className="btn btn-secondary fixed bottom-20 right-2"
                    >
                        <BiChevronUp className='{"h-5 w-5"}'/>

                    </button>

                    <button
                    className='fixed top-10 right-20'
                    >
                        Total Books: {count}
                    </button>
                </div>


            </div>
        </>
    )
}
                            
