
"use client";
import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useEffect, useMemo, useRef, useState} from "react";
import {useSortBy, useTable} from "react-table";
import Image from "next/image";

import InfiniteScroll from "react-infinite-scroll-component";
import {BiChevronUp} from "react-icons/bi";

export default function Home() {

  const scrollRef = useRef(null);
    const [rowData, setRowData] = useState([]);
 

    const [fullData, setFullData] = useState([]); // Store all the data
    const [visibleData, setVisibleData] = useState([]); // Data currently visible in the table

    const [hasMore, setHasMore] = useState(true); // Whether more data is available
    const PAGE_SIZE = 50;


    useEffect(() => {
        fetchData();
        const intervalId = setInterval(fetchData, 60 * 1000);
        // Clean up the interval when the component unmounts
        return () => clearInterval(intervalId);
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
                Header: "Product Form",
                accessor: "ProductForm",
            },
            {
                Header: "Language",
                accessor: "language",
            },

            {
                Header: "Publishing Agency/Publisher Name",
                accessor: "publisher",
            },
            {
                Header: "Author/Editor Name",
                accessor: "author_editor",
            },
            {
                Header: "Publication Date",
                accessor: "Date",
            },
            
        ],
        []
    );

    const fetchData = async () => {
        try {
          
        
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

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable(
        {columns, data: visibleData},
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

  return (
    <>
       <div style={{marginTop: "50px"}}>
                     

                        <div  className=" h-[500px]">
                            <table
                                {...getTableProps()}
                                className=" divide-y divide-gray-200"
                                style={{maxWidth: "80%"}}
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
                                                className="px-4 py-2 text-sm sm:text-base md:text-lg lg:text-xl xl:text-xl"
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
                                                        className="px-4 py-2 text-sm sm:text-base md:text-lg lg:text-xl xl:text-xl"
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
                            <button
                                onClick={scrollToBottom}
                                className="bg-sky-800 hover:bg-sky-600 text-white py-1 px-1 rounded fixed bottom-10 right-2"
                            >
                                <Image
                                    src="/scroll-down.png"
                                    alt="Scrolldown"
                                    width={20}
                                    height={20}
                                />
                            </button>
                            <button
                                onClick={scrollToUp}
                                className="bg-sky-800 hover:bg-sky-600 text-white py-1 px-1 rounded fixed bottom-20 right-2"
                            >
                                <BiChevronUp className={"h-5 w-5"}/>

                            </button>


                        </div>
                        <InfiniteScroll
                            dataLength={visibleData.length}
                            next={fetchMoreData}
                            hasMore={hasMore}
                            loader={<h4 className="text-sky-800">Loading...</h4>}
                            style={{overflow: "hidden"}}/>

       </div>
    </>
  )
}
                            
