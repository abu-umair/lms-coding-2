"use client";

import { getOrderClient } from "@/api/grpc/client";
import FormInput from "@/components/shared/form-input/FormInput";
import useGrpcApi from "@/components/shared/others/useGrpcApi";
import { useCartContext } from "@/contexts/CartContext";
import countTotalPrice from "@/libs/countTotalPrice";
import { CheckoutSchema, CheckoutFormData } from "@/libs/validationSchemaCheckout";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const CheckoutPrimary = ({ cartData, userData }) => {
  const { callApi, isLoading } = useGrpcApi();

  const { fullName, email } = userData;


  const isProducts = cartData && cartData.length > 0;

  const subtotal = cartData.reduce((acc, item) => {
    const price = Number(item.coursePrice);
    const qty = Number(item.quantity);
    return acc + (price * qty); //? acc adalah penampung hasil sementara. dan 0 adalah nilai awal
  }, 0);
  console.log(subtotal);

  const totalPrice = subtotal;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CheckoutFormData>({
    resolver: zodResolver(CheckoutSchema),
    defaultValues: {
      user_full_name: "",
      email: "",
      phone: "",
      address: "",
    }
  });

  const onSubmit = async (values: CheckoutFormData) => {

    const coursesPayload = cartData.map((item) => ({
      id: item.courseId,
      quantity: String(item.quantity)
    }));

    console.log(values);
    console.log(coursesPayload);

    await callApi(
      getOrderClient().createOrder({
        fullName: values.user_full_name,
        // email: values.email,
        phoneNumber: values.phone,
        address: values.address,
        notes: '',
        courses: coursesPayload,

      }),
      {
        // loadingMessage: "Memperbarui kata sandi...",
        // successMessage: "Kata sandi berhasil diperbarui!", // Otomatis muncul toast success
        onSuccess: (res) => {
          reset(),
            console.log(res);
          //! delete cart ketika berhasil checkout/order
          // *task
          //*buat halaman setelah buat checkout/order
          // *buat tidak bisa akses page checkout/order lewat link (harus dari cart)

          // router.push("/");
        },
        useDefaultError: false,
        // defaultError: (res) => {
        //   if (res.response.base?.statusCode !== "200") {
        //     toast.error("Kata sandi lama salah!");
        //   } else {
        //     toast.error("Gagal memperbarui password.");
        //   }
        // }
      }
    );
  };


  return (
    <section>
      <div className="container py-50px lg:py-60px 2xl:py-20 3xl:py-100px">
        <form
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-30px">
            {/* left */}
            <div>
              {/* heading */}
              <h4 className="text-xl text-blackColor dark:text-blackColor-dark font-bold pb-10px mb-5 border-b border-borderColor dark:border-borderColor-dark">
                <span className="leading-1.2">Billing Details</span>
              </h4>
              <div
                data-aos="fade-up"
              >
                <div className="mb-5">
                  <FormInput
                    lableRequired={true}
                    label="Full Name"
                    name="user_full_name"  // Type-safe: akan error jika salah ketik
                    type="text"
                    placeholder="Enter your full name"
                    register={register}
                    errors={errors}
                    disabled={isLoading}
                  />
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-2 lg:gap-x-30px gap-y-5 mb-5">
                  <div>
                    <FormInput
                      lableRequired={true}
                      label="Email"
                      name="email"  // Type-safe: akan error jika salah ketik
                      type="text"
                      placeholder="Email"
                      register={register}
                      errors={errors}
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <FormInput
                      lableRequired={true}
                      label="Phone Number"
                      name="phone"  // Type-safe: akan error jika salah ketik
                      type="text"
                      placeholder="Phone"
                      register={register}
                      errors={errors}
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div className="mb-5">
                  <FormInput
                    lableRequired={true}
                    label="Address"
                    name="address"  // Type-safe: akan error jika salah ketik
                    type="text"
                    placeholder="Address"
                    register={register}
                    errors={errors}
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>
            {/* right */}
            <div className="p-10px lg:p-35px text-blackColor dark:text-blackColor-dark leading-1.8">
              {/* heading */}
              <h4 className="text-2xl text-blackColor dark:text-blackColor-dark font-bold mb-5">
                <span className="leading-1.2">Your Order</span>
              </h4>

              <div className="overflow-auto">
                <table className="table-fixed w-full border-t border-borderColor2 dark:border-borderColor2-dark font-medium">
                  <thead>
                    <tr className="border-b border-borderColor2 dark:border-borderColor2-dark">
                      <td className="p-10px md:p-15px">Product</td>
                      <td className="p-10px md:p-15px">Total</td>
                    </tr>
                  </thead>
                  <tbody>
                    {!isProducts ? (
                      <tr className="border-b border-borderColor2 dark:border-borderColor2-dark">
                        <td className="p-10px md:p-15px">
                          Product Title × <span>0</span>
                        </td>
                        <td className="p-10px md:p-15px">$0.00</td>
                      </tr>
                    ) : (
                      cartData?.map(({ courseName, quantity, coursePrice }, idx) => (
                        <tr
                          key={idx}
                          className="border-b border-borderColor2 dark:border-borderColor2-dark"
                        >
                          <td className="p-10px md:p-15px">
                            {courseName.length > 12 ? courseName.slice(0, 12) : courseName}
                            <span>{quantity}</span>
                          </td>
                          <td className="p-10px md:p-15px">
                            Rp {Number(coursePrice) * Number(quantity)}
                          </td>
                        </tr>
                      ))
                    )}
                    <tr className="border-b border-borderColor2 dark:border-borderColor2-dark">
                      <td className="p-10px md:p-15px">Subtotal</td>
                      <td className="p-10px md:p-15px">
                        Rp {subtotal}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-10px md:p-15px">Total</td>
                      <td className="p-10px md:p-15px">
                        Rp {totalPrice}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* payment method */}
              <div>
                <div className="mt-30px">
                  <button
                    disabled={subtotal ? false : true}
                    className="text-size-15 text-whiteColor bg-primaryColor px-25px py-10px border border-primaryColor hover:text-primaryColor hover:bg-whiteColor inline-block rounded group dark:hover:text-whiteColor dark:hover:bg-whiteColor-dark disabled:cursor-not-allowed disabled:opacity-80 disabled:bg-primaryColor disabled:text-whiteColor"
                  >
                    Place order
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div >
    </section >
  );
};

export default CheckoutPrimary;
