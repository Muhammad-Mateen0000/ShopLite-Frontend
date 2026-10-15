import {
  Edit3,
  ImagePlus,
  LoaderCircle,
  Package,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import { getProducts } from "../../services/productService";
import {
  createAdminProduct,
  deleteAdminProduct,
  updateAdminProduct,
  uploadAdminProductImage,
} from "../../services/adminProductService";
import type { AdminProduct } from "../../types/adminProduct";

const PAGE_LIMIT = 100;

function formatPrice(price: number) {
  return (price / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

function AdminProducts() {
  const [products, setProducts] = useState<
    AdminProduct[]
  >([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);

  const [editingProduct, setEditingProduct] =
    useState<AdminProduct | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] =
    useState("");
  const [price, setPrice] = useState("");

  const [formError, setFormError] = useState("");

  const [isSaving, setIsSaving] = useState(false);

  const [deletingProductId, setDeletingProductId] =
    useState<string | null>(null);

  const [uploadingProductId, setUploadingProductId] =
    useState<string | null>(null);

  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  const [selectedProductId, setSelectedProductId] =
    useState<string | null>(null);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await getProducts({
        search: "",
        minPrice: "",
        maxPrice: "",
        sortBy: "created_at",
        sortOrder: "desc",
        page: 1,
        limit: PAGE_LIMIT,
      });

      setProducts(response.products);
    } catch (productsError) {
      setError(
        productsError instanceof Error
          ? productsError.message
          : "Unable to load products.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadProducts();
  }, []);

  const openCreateForm = () => {
    setEditingProduct(null);
    setName("");
    setDescription("");
    setPrice("");
    setFormError("");
    setIsFormOpen(true);
  };

  const openEditForm = (product: AdminProduct) => {
    setEditingProduct(product);
    setName(product.name);
    setDescription(product.description ?? "");
    setPrice(String(product.price / 100));
    setFormError("");
    setIsFormOpen(true);
  };

  const closeForm = () => {
    if (isSaving) {
      return;
    }

    setIsFormOpen(false);
    setEditingProduct(null);
    setFormError("");
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setFormError("");

    const cleanName = name.trim();
    const cleanDescription = description.trim();
    const numericPrice = Number(price);

    if (!cleanName) {
      setFormError("Product name is required.");
      return;
    }

    if (cleanName.length > 150) {
      setFormError(
        "Product name must not exceed 150 characters.",
      );
      return;
    }

    if (cleanDescription.length > 2000) {
      setFormError(
        "Description must not exceed 2000 characters.",
      );
      return;
    }

    if (
      !price.trim() ||
      !Number.isFinite(numericPrice) ||
      numericPrice < 0
    ) {
      setFormError(
        "Please enter a valid product price.",
      );
      return;
    }

    const priceInCents = Math.round(
      numericPrice * 100,
    );

    try {
      setIsSaving(true);

      if (editingProduct) {
        await updateAdminProduct(
          editingProduct.id,
          {
            name: cleanName,
            description: cleanDescription,
            price: priceInCents,
          },
        );
      } else {
        await createAdminProduct({
          name: cleanName,
          description: cleanDescription,
          price: priceInCents,
        });
      }

      setIsFormOpen(false);
      setEditingProduct(null);

      await loadProducts();
    } catch (saveError) {
      setFormError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save the product.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (
    product: AdminProduct,
  ) => {
    const shouldDelete = window.confirm(
      `Delete "${product.name}"?`,
    );

    if (!shouldDelete) {
      return;
    }

    try {
      setDeletingProductId(product.id);
      setError("");

      await deleteAdminProduct(product.id);

      setProducts((currentProducts) =>
        currentProducts.filter(
          (currentProduct) =>
            currentProduct.id !== product.id,
        ),
      );
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete the product.",
      );
    } finally {
      setDeletingProductId(null);
    }
  };

  const openImagePicker = (productId: string) => {
    setSelectedProductId(productId);
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file || !selectedProductId) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Only JPG, JPEG, PNG and WEBP images are allowed.",
      );

      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Image size must not exceed 2 MB.");

      event.target.value = "";
      return;
    }

    try {
      setUploadingProductId(selectedProductId);
      setError("");

      await uploadAdminProductImage(
        selectedProductId,
        file,
      );

      await loadProducts();
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Unable to upload the product image.",
      );
    } finally {
      setUploadingProductId(null);
      setSelectedProductId(null);
      event.target.value = "";
    }
  };

  return (
    <main className="min-h-[calc(100vh-64px)]">
      <section className="border-b border-[#e8dfd4] bg-[#f3e8dc]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#b45f3c]">
                Administration
              </p>

              <h1 className="mt-2 text-4xl font-bold tracking-tight text-[#51463d]">
                Products
              </h1>

              <p className="mt-3 text-[#756b61]">
                Create, update and manage store products.
              </p>
            </div>

            <button
              type="button"
              onClick={openCreateForm}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#b45f3c] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#9f5031]"
            >
              <Plus size={18} />
              Add Product
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <LoaderCircle
              size={32}
              className="animate-spin text-[#b45f3c]"
            />
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#d9cec2] bg-[#fffdf9] px-5 py-16 text-center">
            <Package
              size={38}
              className="mx-auto text-[#b9aa9d]"
            />

            <h2 className="mt-4 text-lg font-semibold text-[#51463d]">
              No products found
            </h2>

            <p className="mt-2 text-sm text-[#81766b]">
              Add your first product to get started.
            </p>

            <button
              type="button"
              onClick={openCreateForm}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#b45f3c] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#9f5031]"
            >
              <Plus size={17} />
              Add Product
            </button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-[#e5dbd0] bg-[#fffdf9]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">
                <thead>
                  <tr className="border-b border-[#e5dbd0] bg-[#faf6f1]">
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#8a7d70]">
                      Product
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#8a7d70]">
                      Description
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-[#8a7d70]">
                      Price
                    </th>

                    <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wide text-[#8a7d70]">
                      Image
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-[#8a7d70]">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-[#eee6dd] last:border-0"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[#eee5dc]">
                            {product.image_url ? (
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-[#9c8e81]">
                                <Package size={20} />
                              </div>
                            )}
                          </div>

                          <span className="text-sm font-semibold text-[#51463d]">
                            {product.name}
                          </span>
                        </div>
                      </td>

                      <td className="max-w-xs px-5 py-4">
                        <p className="line-clamp-2 text-sm text-[#81766b]">
                          {product.description ||
                            "No description"}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-right text-sm font-semibold text-[#51463d]">
                        {formatPrice(product.price)}
                      </td>

                      <td className="px-5 py-4 text-center">
                        <button
                          type="button"
                          onClick={() =>
                            openImagePicker(product.id)
                          }
                          disabled={
                            uploadingProductId ===
                            product.id
                          }
                          className="inline-flex items-center gap-2 rounded-lg border border-[#d8c7b7] px-3 py-2 text-xs font-semibold text-[#655b52] transition hover:border-[#b45f3c] hover:text-[#a65332] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {uploadingProductId ===
                          product.id ? (
                            <LoaderCircle
                              size={15}
                              className="animate-spin"
                            />
                          ) : (
                            <ImagePlus size={15} />
                          )}

                          {uploadingProductId ===
                          product.id
                            ? "Uploading"
                            : "Upload"}
                        </button>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              openEditForm(product)
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg border border-[#d8c7b7] px-3 py-2 text-xs font-semibold text-[#655b52] transition hover:border-[#b45f3c] hover:text-[#a65332]"
                          >
                            <Edit3 size={15} />
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              void handleDelete(product)
                            }
                            disabled={
                              deletingProductId ===
                              product.id
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {deletingProductId ===
                            product.id ? (
                              <LoaderCircle
                                size={15}
                                className="animate-spin"
                              />
                            ) : (
                              <Trash2 size={15} />
                            )}

                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleImageUpload}
        className="hidden"
      />

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-[#e5dbd0] bg-[#fffdf9] shadow-xl">
            <div className="flex items-center justify-between border-b border-[#e5dbd0] px-6 py-5">
              <div>
                <h2 className="text-xl font-semibold text-[#51463d]">
                  {editingProduct
                    ? "Edit Product"
                    : "Add Product"}
                </h2>

                <p className="mt-1 text-sm text-[#81766b]">
                  Enter the product information below.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                disabled={isSaving}
                className="rounded-lg p-2 text-[#81766b] transition hover:bg-[#f3e8dc] hover:text-[#51463d]"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
            >
              <div>
                <label
                  htmlFor="product-name"
                  className="text-sm font-medium text-[#51463d]"
                >
                  Product Name
                </label>

                <input
                  id="product-name"
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  maxLength={150}
                  placeholder="Product name"
                  className="mt-2 w-full rounded-xl border border-[#d9cec2] bg-white px-4 py-3 text-sm text-[#51463d] outline-none transition focus:border-[#b45f3c]"
                />
              </div>

              <div>
                <label
                  htmlFor="product-description"
                  className="text-sm font-medium text-[#51463d]"
                >
                  Description
                </label>

                <textarea
                  id="product-description"
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  maxLength={2000}
                  rows={5}
                  placeholder="Product description"
                  className="mt-2 w-full resize-none rounded-xl border border-[#d9cec2] bg-white px-4 py-3 text-sm text-[#51463d] outline-none transition focus:border-[#b45f3c]"
                />
              </div>

              <div>
                <label
                  htmlFor="product-price"
                  className="text-sm font-medium text-[#51463d]"
                >
                  Price (USD)
                </label>

                <input
                  id="product-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(event) =>
                    setPrice(event.target.value)
                  }
                  placeholder="0.00"
                  className="mt-2 w-full rounded-xl border border-[#d9cec2] bg-white px-4 py-3 text-sm text-[#51463d] outline-none transition focus:border-[#b45f3c]"
                />

                <p className="mt-2 text-xs text-[#8a7d70]">
                  Price is entered in dollars and sent to
                  the backend in cents.
                </p>
              </div>

              {formError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {formError}
                </div>
              )}

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={isSaving}
                  className="rounded-xl border border-[#d8c7b7] px-5 py-3 text-sm font-semibold text-[#655b52] transition hover:border-[#b45f3c] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#b45f3c] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#9f5031] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving ? (
                    <LoaderCircle
                      size={17}
                      className="animate-spin"
                    />
                  ) : editingProduct ? (
                    <Save size={17} />
                  ) : (
                    <Plus size={17} />
                  )}

                  {isSaving
                    ? "Saving..."
                    : editingProduct
                      ? "Save Changes"
                      : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export default AdminProducts;