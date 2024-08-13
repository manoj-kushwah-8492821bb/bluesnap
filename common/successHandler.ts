// --------- Success Handler ---------- //
const successHandler = (res: any, data: any) => {
  res.json({
    error: false,
    success: true,
    ...data,
  });
};

export default successHandler;
