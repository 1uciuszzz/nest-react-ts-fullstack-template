import {
  Alert,
  Button,
  FormControl,
  FormLabel,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import VStack from "../../components/VStack";
import { useImmer } from "use-immer";
import { API_AUTH, Gender, Profile } from "../../apis/auth";
import { useAtomValue, useSetAtom } from "jotai";
import { profileAtom } from "../stores/profile";
import HStack from "../../components/HStack";
import { AccountCircle } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { API_MINIO_FILE } from "../../apis/minioFile";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const profile = useAtomValue(profileAtom);

  const [data, setData] = useImmer<Profile>(profile);

  const AvatarInputRef = useRef<HTMLInputElement>(null);

  const {
    isPending: uploadAvatarIsPending,
    mutate: uploadAvatar,
    isError: uploadAvatarIsError,
    error: uploadAvatarError,
  } = useMutation({
    mutationFn: (file: File) => API_MINIO_FILE.UPLOAD_SMALL_FILE(file),
    onSuccess: (res) => {
      setData((d) => {
        d.avatarId = res.data.id;
      });
      AvatarInputRef.current!.value = "";
    },
  });

  const setProfile = useSetAtom(profileAtom);

  const {
    isPending: saveIsPending,
    mutate: save,
    isError: saveIsError,
    error: saveError,
  } = useMutation({
    mutationFn: () =>
      API_AUTH.UPDATE_PROFILE({
        avatarId: data.avatarId || "",
        bio: data.bio || "",
        birthday: data.birthday || "",
        email: data.email || "",
        firstName: data.firstName || "",
        gender: data.gender || Gender.OTHER,
        lastName: data.lastName || "",
        phone: data.phone || "",
      }),
    onSuccess: (res) => {
      setProfile(res.data);
      toast.success("Saved");
    },
  });

  const handleSave = () => {
    save();
  };

  return (
    <>
      <div className="p-4">
        <VStack>
          <Typography variant="h5">Turbo guacamole</Typography>

          <Typography variant="h6">Profile page</Typography>

          {uploadAvatarIsError && (
            <Alert severity="error">{uploadAvatarError.message}</Alert>
          )}

          <div className="flex justify-center">
            <input
              type="file"
              ref={AvatarInputRef}
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadAvatar(file);
              }}
              accept="image/*"
            />
            <IconButton
              onClick={() => AvatarInputRef.current!.click()}
              disabled={uploadAvatarIsPending}
            >
              {data.avatarId ? (
                <img
                  src={`/api/minio-file/${data.avatarId}`}
                  alt="avatar"
                  className="w-20 h-20 rounded-full"
                />
              ) : (
                <AccountCircle fontSize="large" />
              )}
            </IconButton>
          </div>

          <HStack>
            <TextField
              variant="standard"
              label="First Name"
              type="text"
              value={data.firstName || ""}
              onChange={(e) =>
                setData((d) => {
                  d.firstName = e.target.value;
                })
              }
            />

            <TextField
              variant="standard"
              label="Last Name"
              type="text"
              value={data.lastName || ""}
              onChange={(e) =>
                setData((d) => {
                  d.lastName = e.target.value;
                })
              }
            />
          </HStack>

          <TextField
            variant="standard"
            label="Bio"
            type="text"
            value={data.bio || ""}
            onChange={(e) =>
              setData((d) => {
                d.bio = e.target.value;
              })
            }
            multiline
            rows={3}
          />

          <FormControl variant="standard">
            <FormLabel>Gender</FormLabel>
            <Select
              label="Gender"
              value={data.gender || Gender.OTHER}
              onChange={(e) => {
                setData((d) => {
                  d.gender = e.target.value as Gender;
                });
              }}
            >
              <MenuItem value={Gender.MALE}>Male</MenuItem>
              <MenuItem value={Gender.FEMALE}>Female</MenuItem>
              <MenuItem value={Gender.OTHER}>Other</MenuItem>
            </Select>
          </FormControl>

          <TextField
            variant="standard"
            label="Email"
            type="text"
            value={data.email || ""}
            onChange={(e) =>
              setData((d) => {
                d.email = e.target.value;
              })
            }
          />

          <TextField
            variant="standard"
            label="Phone"
            type="text"
            value={data.phone || ""}
            onChange={(e) =>
              setData((d) => {
                d.phone = e.target.value;
              })
            }
          />

          <DatePicker
            label="Birthday"
            value={data.birthday ? dayjs(data.birthday) : null}
            onChange={(v) => {
              setData((d) => {
                d.birthday = v?.toISOString() || "";
              });
            }}
            slotProps={{
              textField: {
                variant: "standard",
              },
            }}
          />

          {saveIsError && <Alert severity="error">{saveError.message}</Alert>}

          <Button
            variant="outlined"
            onClick={handleSave}
            disabled={saveIsPending}
          >
            Save
          </Button>
        </VStack>
      </div>
    </>
  );
};

export default ProfilePage;
