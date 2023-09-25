"use client";

import InputComponent from "@/components/FormElement/InputComponent";
import SelectComponent from "@/components/FormElement/SelectComponent";
import ComponentLevelLoader from "@/components/Loader/ComponentLevel";
import Notification from "@/components/Loader/Notifycation";
import TileComponent from "@/components/TileComponent";
import { GlobalContext } from "@/context";
import { addNewProduct, updateProduct } from "@/services/product";
import {
  AvailableSizes,
  adminAddProductformControls,
  firebaseConfig,
  firebaseStorageURL,
} from "@/utils";
import { initializeApp } from "firebase/app";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const app = initializeApp(firebaseConfig);
const storage = getStorage(app, firebaseStorageURL);

const createUniqueFileName = (getFile) => {
  const timeStamp = Date.now();
  const randomStringValue = Math.random().toString(36).substring(2, 12);
  return `${getFile.name}-${timeStamp}-${randomStringValue}`;
};

const helperForUploadingImageToFirebase = async (file) => {
  const getFileName = createUniqueFileName(file);
  const storageReference = ref(storage, `ecommerce/${getFileName}`);
  const uploadImage = uploadBytesResumable(storageReference, file);

  return new Promise((resolve, reject) => {
    uploadImage.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadImage.snapshot.ref)
          .then((downloandUrl) => resolve(downloandUrl))
          .catch((error) => reject(error));
      }
    );
  });
};

const initialFormData = {
  name: "",
  price: 0,
  description: "",
  category: "men",
  sizes: [],
  deliveryInfo: "",
  onSale: "no",
  imageUrl: "",
  priceDrop: 0,
};
function AdminAddNewProduct() {
  const [formData, setFormData] = useState(initialFormData);
  const {
    componentLevelLoader,
    setComponentLevelLoader,
    currentUpdatedProduct,
    setCurrentUpdatedProduct,
  } = useContext(GlobalContext);

  const router = useRouter();

  useEffect(() => {
    if (currentUpdatedProduct !== null) {
      setFormData(currentUpdatedProduct);
    }
  }, []);

  const handleImage = async (e) => {
    const extractImageUrl = await helperForUploadingImageToFirebase(
      e.target.files[0]
    );

    if (extractImageUrl !== "") {
      setFormData({
        ...formData,
        imageUrl: extractImageUrl,
      });
    }
  };

  const handleTileClick = (getCurrentItem) => {
    let cpySizes = [...formData.sizes];
    const index = cpySizes.findIndex((item) => item.id === getCurrentItem.id);

    if (index === -1) {
      cpySizes.push(getCurrentItem);
    } else {
      cpySizes = cpySizes.filter((item) => item.id !== getCurrentItem.id);
    }

    setFormData({ ...formData, sizes: cpySizes });
  };

  const handleAddProduct = async () => {
    setComponentLevelLoader({ loading: true, id: "" });

    const res =
      currentUpdatedProduct !== null
        ? await updateProduct(formData)
        : await addNewProduct(formData);

    if (res.success) {
      setComponentLevelLoader({ loading: false, id: "" });
      toast.success(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setFormData(initialFormData);
      setCurrentUpdatedProduct(null);
      setTimeout(() => {
        router.push("/admin-view/all-product");
      }, 1000);
    } else {
      setComponentLevelLoader({ loading: false, id: "" });
      toast.error(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setFormData(initialFormData);
    }
  };
  return (
    <div className="w-full mt-5 mr-0 mb-0 ml-0 relative">
      <div className="flex flex-col items-start justify-start p-10 bg-white shadow-2xl rounded-xl relative">
        <div className="w-full mt-6 mr-0 mb-0 ml-0 space-y-8">
          <input
            accept="image/*"
            max="1000000"
            type="file"
            onChange={handleImage}
          />
          <div className="flex gap-2 flex-col">
            <label>Available sizes</label>
            <TileComponent
              selected={formData.sizes}
              data={AvailableSizes}
              onClick={handleTileClick}
            />
          </div>
          {adminAddProductformControls.map((controlItem) =>
            controlItem.componentType === "input" ? (
              <InputComponent
                label={controlItem.label}
                placeholder={controlItem.placeholder}
                type={controlItem.type}
                key={controlItem.id}
                value={formData[controlItem.id]}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [controlItem.id]: e.target.value,
                  })
                }
              />
            ) : controlItem.componentType === "select" ? (
              <SelectComponent
                label={controlItem.label}
                options={controlItem.options}
                key={controlItem.id}
                value={formData[controlItem.id]}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [controlItem.id]: e.target.value,
                  })
                }
              />
            ) : null
          )}
          <button
            onClick={handleAddProduct}
            className="inline-flex w-full items-center justify-center bg-black text-white px-6 py-4 text-lg font-medium uppercase"
          >
            {componentLevelLoader && componentLevelLoader.loading ? (
              <ComponentLevelLoader
                color={"#fff"}
                loading={componentLevelLoader && componentLevelLoader.loading}
                text={
                  currentUpdatedProduct !== null
                    ? "Updating Product"
                    : "Adding Product"
                }
              />
            ) : currentUpdatedProduct !== null ? (
              "Update Product"
            ) : (
              "Add Product"
            )}
          </button>
        </div>
      </div>
      <Notification />
    </div>
  );
}

export default AdminAddNewProduct;
