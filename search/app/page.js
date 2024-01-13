
"use client";
import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useEffect, useMemo, useRef, useState} from "react";
import {useSortBy, useTable} from "react-table";
import debounce from 'lodash/debounce';
import { BiSearch,BiX } from "react-icons/bi";
import InfiniteScroll from "react-infinite-scroll-component";
import {BiChevronDown, BiChevronUp} from "react-icons/bi";

export default function Home() {

  const scrollRef = useRef(null);
   
 
  
    const [fullData, setFullData] = useState([]); // Store all the data
    const [visibleData, setVisibleData] = useState([]); // Data currently visible in the table
    const [searchQuery, setSearchQuery] = useState('');
    const [filterData, setFilterData] = useState([]);
    const [hasMore, setHasMore] = useState(true); // Whether more data is available
    const PAGE_SIZE = 50;


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
                Header:"Publisher",
                accessor: "publisher",
            },
            {
                Header: "Author/Editor Name",
                accessor: "author_editor",
            },
            {
                Header: "Date",
                accessor: (row)=>{
                  const fullDate = row.Date;
                  if(fullDate){

                    const year =new Date(fullDate).getFullYear();
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
          
            console.log("call");
            const response = await fetch(
                "http://localhost:8000/books/viewbooks"
            );
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
             
         
            
            const fetchedData = await response.json();
           
            
            setFullData(fetchedData);
            setVisibleData(fetchedData.slice(0, PAGE_SIZE));
        
        } catch (error) {
            console.error("Error fetching data:", error.message);
        }
    };
    const fetchMoreData = () => {
      console.log("Fetching")
        const currentLength = visibleData.length;
        const nextData = fullData.slice(currentLength, currentLength + PAGE_SIZE);
        setVisibleData([...visibleData, ...nextData]);
        setHasMore(currentLength + PAGE_SIZE < fullData.length);
    };

    const filteredData = (fullData,searchQuery)=>{
          return fullData.filter((item)=> item.isbn.includes(searchQuery));
    }
    
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable(
        {columns, data: (filterData.length!==0)?filterData: visibleData},
        useSortBy
    );
    const scrollToBottom = () => {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth",
        });
    };
    const scrollToUp = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handleSearchClick = () => {
      const result = filteredData(fullData, searchQuery);
      setFilterData(result);
    };
  
    const handleClearClick = () => {
      setSearchQuery('');
      setFilterData([]);  // Reset filterData when clearing the search
    };

  return (
    <>
       <div style={{marginTop: "50px"}}>
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
              <BiSearch />
            </button>
            {searchQuery && (
              <button
                className="btn btn-secondary"
                onClick={handleClearClick}
              >
                <BiX />
              </button>
            )}
          </div>

                        <div  className=" h-[500px] ">
                            <table
                                {...getTableProps()}
                                className="table table-bordered table-hover"
                                style={{maxWidth: "100%"}}
                                ref={scrollRef}
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
                                                className="px-3 py-2 text-sm sm:text-base bg-primary text-white"
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


                        </div>
                        <InfiniteScroll
                            dataLength={visibleData.length}
                            next={fetchMoreData}
                            hasMore={hasMore}
                            style={{overflow: "hidden"}}/>

       </div>
    </>
  )
}
                            
