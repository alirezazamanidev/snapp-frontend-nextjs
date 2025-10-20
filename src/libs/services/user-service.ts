export const GetRole = async (token: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/user/get-role`,
    {
      headers: {
        Cookie: `snapp-session=${token}`,
      },
      cache: 'no-store',
    },
  );
  if (res.status !== 200) {
    return null;
  }
  const data = await res.json();
  return data?.role;
};

export const CheckDriverProfile = async (token: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/user/check-driver-profile`,
    {
      headers: {
        Cookie: `snapp-session=${token}`,
      },
      cache: 'no-store',
    },
  );
  if (res.status !== 200) {
    return false;
  }
  const data = await res.json();
  return data?.hasProfile;
};