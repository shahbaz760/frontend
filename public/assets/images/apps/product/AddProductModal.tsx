import { useAppDispatch } from "app/store/store";
import { useCallback, useEffect, useState, Dispatch, SetStateAction } from "react";
import { useSelector } from "react-redux";
import { Button, Card, CardContent, Typography } from "@mui/material";
import CommonModal from "../CommonModal";
import { AgentGroupRootState } from "app/store/Agent group/Interface";
import { getProductList } from "app/store/Agent group";

interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  handleData?: any;
  isEditing?: boolean;
}

function AddProductModel({ isOpen, setIsOpen, handleData, isEditing }: IProps) {
  const dispatch = useAppDispatch();
  const { productList } = useSelector(
    (store: AgentGroupRootState) => store.agentGroup
  );

  const fetchAgentList = useCallback(() => {
    dispatch(getProductList(""));
  }, [dispatch]);

  useEffect(() => {
    fetchAgentList();
  }, [fetchAgentList]);

  return (
    <CommonModal
      open={isOpen}
      handleToggle={() => {
        setIsOpen(false);
      }}
      modalTitle={"Add New Product"}
      maxWidth="733"
      show
    >
      <div className="flex flex-col gap-20 mb-20 p-20">
        {productList?.map((product: any) => (
          <Card
            key={product.id}
            className="w-full h-[200px] bg-white shadow-md rounded-lg"
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
                  {product.description}
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
                  className="font-bold text-[32px]"
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
                  className="w-[206px] text-[18px]"
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
    </CommonModal>
  );
}

export default AddProductModel;
