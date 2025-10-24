"use client";

import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/react";
import { COMMANDS, REALMS, HASH } from "@/constants";

type SearchFormValues = {
  command: string;
  character: string;
  guild: string;
  type: string;
  commodity: string;
  hash: string;
};

export const SearchForm = () => {
  const router = useRouter();
  const [selectedRealm, setSelectedRealm] = useState(REALMS[0].value);

  const {
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm<SearchFormValues>({
    defaultValues: {
      command: "character",
      character: "",
      guild: "",
      commodity: "",
      hash: "",
      type: "a",
    },
  });

  const command = watch("command");

  const onSubmit = async (values: SearchFormValues) => {
    let route = "/";

    switch (values.command) {
      case "character":
        route = `/character/${values.character}@${selectedRealm}`;
        break;
      case "guild":
        route = `/guild/${values.guild}@${selectedRealm}`;
        break;
      case "hash":
        route = `/hash/${values.type}@${values.hash}`;
        break;
      case "commodity":
        route = `/commodity/${values.commodity}@${selectedRealm}`;
        break;
      case "gold":
        route = `/gold@${selectedRealm}`;
        break;
    }

    await router.push(route);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-4xl">
      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-4 items-start flex-wrap">
          <Controller
            name="command"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                label="Command"
                className="w-full md:w-48"
                selectedKeys={field.value ? [field.value] : []}
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0] as string;
                  field.onChange(value);
                }}
              >
                {COMMANDS.map((option) => (
                  <SelectItem key={option.value}>{option.label}</SelectItem>
                ))}
              </Select>
            )}
          />

          {command === "character" && (
            <Fragment>
              <Controller
                name="character"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Character"
                    className="w-full md:flex-1"
                  />
                )}
              />
              <div className="flex items-center justify-center px-2 pt-6">
                <span className="text-2xl font-bold text-default-500">@</span>
              </div>
              <Select
                label="Realm"
                className="w-full md:flex-1"
                selectedKeys={[selectedRealm]}
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0] as string;
                  setSelectedRealm(value);
                }}
              >
                {REALMS.map((option) => (
                  <SelectItem key={option.value}>{option.label}</SelectItem>
                ))}
              </Select>
            </Fragment>
          )}

          {command === "guild" && (
            <Fragment>
              <Controller
                name="guild"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Guild"
                    className="w-full md:flex-1"
                  />
                )}
              />
              <div className="flex items-center justify-center px-2 pt-6">
                <span className="text-2xl font-bold text-default-500">@</span>
              </div>
              <Select
                label="Realm"
                className="w-full md:flex-1"
                selectedKeys={[selectedRealm]}
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0] as string;
                  setSelectedRealm(value);
                }}
              >
                {REALMS.map((option) => (
                  <SelectItem key={option.value}>{option.label}</SelectItem>
                ))}
              </Select>
            </Fragment>
          )}

          {command === "hash" && (
            <Fragment>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Type"
                    className="w-full md:w-32"
                    selectedKeys={field.value ? [field.value] : []}
                    onSelectionChange={(keys) => {
                      const value = Array.from(keys)[0] as string;
                      field.onChange(value);
                    }}
                  >
                    {HASH.map((option) => (
                      <SelectItem key={option.value}>{option.label}</SelectItem>
                    ))}
                  </Select>
                )}
              />
              <div className="flex items-center justify-center px-2 pt-6">
                <span className="text-2xl font-bold text-default-500">@</span>
              </div>
              <Controller
                name="hash"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Hash"
                    className="w-full md:flex-1"
                  />
                )}
              />
            </Fragment>
          )}

          {command === "commodity" && (
            <Fragment>
              <Controller
                name="commodity"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Commodity"
                    className="w-full md:flex-1"
                  />
                )}
              />
              <div className="flex items-center justify-center px-2 pt-6">
                <span className="text-2xl font-bold text-default-500">@</span>
              </div>
              <Select
                label="Realm"
                className="w-full md:flex-1"
                selectedKeys={[selectedRealm]}
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0] as string;
                  setSelectedRealm(value);
                }}
              >
                {REALMS.map((option) => (
                  <SelectItem key={option.value}>{option.label}</SelectItem>
                ))}
              </Select>
            </Fragment>
          )}

          {command === "gold" && (
            <Fragment>
              <div className="flex items-center justify-center px-2 pt-6">
                <span className="text-2xl font-bold text-default-500">@</span>
              </div>
              <Select
                label="Realm"
                className="w-full md:flex-1"
                selectedKeys={[selectedRealm]}
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0] as string;
                  setSelectedRealm(value);
                }}
              >
                {REALMS.map((option) => (
                  <SelectItem key={option.value}>{option.label}</SelectItem>
                ))}
              </Select>
            </Fragment>
          )}

          <Button
            type="submit"
            color="secondary"
            size="lg"
            isLoading={isSubmitting}
            isIconOnly
            className="mt-1"
          >
            →
          </Button>
        </div>
      </div>
    </form>
  );
};
