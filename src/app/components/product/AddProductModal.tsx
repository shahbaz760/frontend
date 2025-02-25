import { useAppDispatch } from "app/store/store";
import {
  useCallback,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import { useSelector } from "react-redux";
import { Button, Card, CardContent, Tooltip, Typography } from "@mui/material";
import CommonModal from "../CommonModal";
import { getProductPublicList } from "app/store/Product";
import CommonModalPublic from "../CommonModalPublic";

interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  handleData: any;
  isEditing?: boolean;
  selectedProduct: any[];
  onClose?:()=>void
}

function AddProductModel({
  isOpen,
  setIsOpen,
  handleData,
  isEditing,
  onClose,
  selectedProduct,
}: IProps) {
  const dispatch = useAppDispatch();
  const { productList } = useSelector((store: any) => store.product);
  // const productList  = useSelector((store: any) => store;

  const [filteredProductList, setFilteredProductList] = useState<any[]>([]);

  const fetchProductList = useCallback(() => {
    dispatch(getProductPublicList({
      start:0,limit:-1,    }));
  }, [dispatch]);

  useEffect(() => {
    fetchProductList();
  }, [fetchProductList]);

  useEffect(() => {
    const updatedProductList = productList?.filter(
      (product: any) => !selectedProduct.some((p) => p.id === product.id)
    );
    setFilteredProductList(updatedProductList);
    console.log("ghdf",productList)
  }, [productList, selectedProduct]);

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };
  return (
    <CommonModalPublic
      open={isOpen}
      handleToggle={() => {
        console.log('hdfhd')
       onClose();
      }}
      modalTitle={"Add New Product"}
      maxWidth="733"
      btn={false} 
      bgColor={"#F7F9FB"}
      headerBgColor="#ffffff"
      subtitle={true}
     
      
    >
      <div className="flex flex-col gap-20 mb-20 p-20">
        {filteredProductList?.map((product: any) => (
          <Card
            key={product.id}
            className="w-full h-[200px] bg-white shadow-sm rounded-lg"
            style={{
              boxShadow:" 0px 4px 44px 0px #D6D7E333"

            }}
          >
            <CardContent className="flex flex-col h-full justify-between">
              <div>
                <Typography variant="h6" className="font-bold text-[24px]">
                  {product.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  className="my-4 text-[14px]"
                >
                   <Tooltip title={product.description} arrow>
                    <span>{truncateText(product.description, 100)}</span>
                  </Tooltip>
                
                </Typography>
              </div>
              <div
                className="mt-10"
                style={{
                  alignItems: "center",
                  width: "100%",
                  borderTop: "1px solid #B0B3B882",
                  bottom: "0",
                  opacity: "1",
                }}
              />
              <div className="flex justify-between items-center">
                <Typography
                  variant="h5"
                  className="font-bold text-[28px]"
                  style={{ color: "#4F46E5" }}
                >
                  ${product.unit_price}
                </Typography>
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: "#4F46E5",
                    color: "white",
                    textTransform: "capitalize",
                  }}
                  className="w-[206px] text-[16px]"
                  onClick={() => {
                    handleData(product);
                    setIsOpen(false);
                  }}
                >
                  Add Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </CommonModalPublic>
  );
}

export default AddProductModel;
