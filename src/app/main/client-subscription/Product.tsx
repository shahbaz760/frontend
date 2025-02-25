

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Card, CardContent, Typography, Button, Tooltip } from "@mui/material";
import { useAppDispatch } from "app/store/store";
import bgImg from "../../../../public/assets/images/apps/product/product-bg.png";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { getProductPublicList } from "app/store/Product";
import ListLoading from "@fuse/core/ListLoading";
import { debounce } from "lodash";
import { filterType } from "app/store/Projects/Interface";
import { NoDataFound } from "public/assets/icons/common";
// import { TruncateText } from "src/app/pages/manageProducts/ManageProducts";

const Product = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [start, setStart] = useState<number>(0);
  const { total, subscriptionData, productList } = useSelector(
    (store: any) => store.product
  );

  console.log("total", total);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [products, setProducts] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [data, setData] = useState(productList);
  const [lastScrollTop, setLastScrollTop] = useState<any>(0);

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  const [filters, setfilters] = useState<filterType>({
    start: 0,
    limit: 20,
    search: "",
  });

  const fetchProductList = async () => {
    setLoading(true);
    try {
      const res = await dispatch(getProductPublicList(filters));

      setData(res);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductList();
  }, []);

  useEffect(() => {
    if (productList && productList?.length > 0) {
      setProducts((prevChats) => {
        const newChats = productList?.filter(
          (chat) => !prevChats?.some((prevChat) => prevChat?.id === chat?.id)
        );
        return [...prevChats, ...newChats];
      });
    }

    console.log("ffffff", products);
  }, [productList, setProducts]);

  console.log("55ffffff", productList.length);

  const scrollRef = useRef();
  const handleScroll = useCallback(
    debounce(async () => {
      if (scrollRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        const hasMoreData = products?.length < total;
        console.log(
          "scroll",
          scrollTop,
          scrollHeight,
          clientHeight,
          hasMoreData
        );

        if (scrollHeight - scrollTop >= clientHeight - 50 && hasMoreData) {
          const payload = {
            start: page + 1,
            limit: 20,
            search: "",
          };
          try {
            const res = await dispatch(getProductPublicList(payload));
            console.log("loading more", res);
            setPage(page + 1);
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        } else {
          console.debug("No more data");
        }
        setLastScrollTop(scrollTop);
      }
    }, 300),
    [productList, page]
  );

  const navigate = useNavigate();

  return (
    <div
      className="bg-gray-100 min-h-screen overflow-y-auto"
      style={{ height: "100vh" }}
      ref={scrollRef}
      onScroll={handleScroll}
    >
      <header className="w-full h-[104px] bg-white flex items-center justify-center border-t border-b border-[#EDEDFC]">
        <img
          src="assets/icons/remote-icon.svg"
          alt="Header Icon"
          width={190}
          height={54}
        />
      </header>

      <div className="p-44 bg-[#F7F9FB] ">
        <div className="relative mt-8 mb-12">
          <img
            src={bgImg}
            alt="Product Background"
            className="w-full h-[248px] object-cover rounded-lg"
          />
          <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center bg-black bg-opacity-0 text-center">
            <h1 className="text-black text-[40px] font-bold">
              Some of Our Products
            </h1>
            <p className="text-[#11182794] text-[16px] mt-4 max-w-2xl">
              Discover a selection of our innovative offerings designed to meet
              your needs. Each product is crafted with quality, functionality,
              and customer satisfaction.
            </p>
          </div>
        </div>

        <div
          className="py-44 w-full"
          style={{
            height: "auto",
            top: "475px",
            left: "293px",
            display: "flex",
            gap: "20px",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h6"
            className="text-[24px] font-[600] whitespace-nowrap"
          >
            Product Listing
          </Typography>
          <div
            className=""
            style={{
              alignItems: "center",
              width: "100%",
              borderTop: "1px solid #B0B3B882",
              bottom: "0",
              opacity: "1",
            }}
          />
        </div>

        {loading && start === 0 ? (
          <div className="flex flex-col justify-center align-items-center gap-20 bg-[#F7F9FB] h-full min-h-[400px] py-40">
            <ListLoading />
          </div>
        ) : !loading && products?.length == 0 ? (
          <div className="flex flex-col justify-center items-center gap-20 bg-[#F7F9FB] h-full min-h-[400px] py-40">
            <NoDataFound />
            <Typography className="text-[24px] text-center font-600 leading-normal">
              No Product found!
            </Typography>
          </div>
        ) : (
          <>
            {products?.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
                {products?.map((product: any) => (
                  <div key={product?.id} className="mb-12">
                    <Card className="w-full h-[200px] bg-white shadow-md rounded-lg">
                      <CardContent className="flex flex-col h-full justify-between">
                        <div className=" w-full">
                          <Typography
                            variant="h6"
                            className="font-[600] text-[24px]"
                          >
                            {product?.name?.length > 30 ? (
                              <Tooltip title={product?.name} arrow>
                                <span>{truncateText(product?.name, 30)}</span>
                              </Tooltip>
                            ) : (
                              <span>{product?.name}</span>
                            )}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            className="my-4 text-[14px] font-[400]"
                          >
                            {product?.description?.length > 70 ? (
                              <Tooltip title={product?.description} arrow>
                                <span>
                                  {truncateText(product?.description, 70)}
                                </span>
                              </Tooltip>
                            ) : (
                              <span>{product?.description}</span>
                            )}
                          </Typography>
                        </div>
                        <div className="flex justify-between items-center">
                          <Typography
                            variant="h5"
                            className="font-[700] text-[28px]"
                            style={{ color: "#4F46E5" }}
                          >
                            ${product?.unit_price}
                          </Typography>

                          <Button
                            variant="contained"
                            sx={{
                              backgroundColor: "#4F46E5",
                              color: "white",
                              height: "50px",
                              width: "206px",
                              textTransform: "capitalize",
                              "&:hover": {
                                backgroundColor: "#3730a3",
                              },
                            }}
                            className="lg:w-[206px] w-[150px] h-[50px] text-[16px]"
                            onClick={() =>
                              navigate("/client-subscription/cart", {
                                state: { product },
                              })
                            }
                          >
                            Buy Now
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {loading && start > 0 && (
          <div className="text-center">Loading more...</div>
        )}
      </div>
    </div>
  );
};

export default Product;
