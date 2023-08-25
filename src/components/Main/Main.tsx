import { useState } from "react";
import { Box, Button, TextInput } from "@mantine/core";

interface Data {
  entryPoint: string;
  walletOwner: string;
  upgradeDelay: string;
}

const Main = () => {
  const [data, setData] = useState<Data>({
    entryPoint: "",
    walletOwner: "",
    upgradeDelay: "",
  });

  return (
    <Box
      w={500}
      mx="auto"
      p={20}
      sx={{
        borderRadius: "10px",
        backgroundColor: "#fff",
      }}
    >
      <Box>
        <TextInput
          label="Entry Point Contract"
          placeholder=" Entry Point Contract here "
          withAsterisk
          my={20}
          value={data.entryPoint}
          onChange={(e) =>
            setData((prev) => ({ ...prev, entryPoint: e.target.value }))
          }
        />
        <TextInput
          label="Wallet Owner"
          placeholder=" Wallet owner here "
          withAsterisk
          my={20}
          value={data.walletOwner}
          onChange={(e) =>
            setData((prev) => ({ ...prev, walletOwner: e.target.value }))
          }
        />
        <TextInput
          label="Upgrade Delay"
          placeholder=" Upgrade Delay here "
          withAsterisk
          my={20}
          value={data.upgradeDelay}
          onChange={(e) =>
            setData((prev) => ({ ...prev, upgradeDelay: e.target.value }))
          }
        />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button
          variant="gradient"
          gradient={{ from: "indigo", to: "cyan" }}
          fullWidth
          h={50}
          size="20px"
        >
          Create
        </Button>
      </Box>
    </Box>
  );
};
export default Main;
