"use client";

import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import {
  Select,
  SelectItem,
  Autocomplete,
  AutocompleteItem,
} from "@heroui/react";

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
    <form className="w-full max-w-4xl" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-4 items-start flex-wrap">
          <Controller
            control={control}
            name="command"
            render={({ field }) => (
              <div className="w-full md:w-48">
                <Select
                  {...field}
                  disallowEmptySelection
                  className="w-full heroui-select-fix"
                  classNames={{
                    trigger: "min-h-[56px] h-[56px]",
                  }}
                  label="Command"
                  labelPlacement="inside"
                  selectedKeys={field.value ? [field.value] : []}
                  variant="flat"
                  onSelectionChange={(keys) => {
                    const value = Array.from(keys)[0] as string;

                    field.onChange(value);
                  }}
                >
                  {COMMANDS.map((option) => (
                    <SelectItem key={option.value}>{option.label}</SelectItem>
                  ))}
                </Select>
              </div>
            )}
          />

          {command === "character" && (
            <Fragment>
              <Controller
                control={control}
                name="character"
                render={({ field }) => (
                  <Input
                    {...field}
                    className="w-full md:flex-1"
                    label="Character"
                    labelPlacement="inside"
                  />
                )}
              />
              <div className="flex items-center justify-center">
                <span className="text-3xl font-bold text-default-500">@</span>
              </div>
              <Autocomplete
                allowsCustomValue
                className="w-full md:flex-1 heroui-select-fix"
                defaultSelectedKey={selectedRealm}
                label="Realm"
                labelPlacement="inside"
                onInputChange={(value) => {
                  if (value) setSelectedRealm(value);
                }}
                onSelectionChange={(key) => {
                  if (key) setSelectedRealm(key as string);
                }}
              >
                {REALMS.map((option) => (
                  <AutocompleteItem key={option.value}>
                    {option.label}
                  </AutocompleteItem>
                ))}
              </Autocomplete>
            </Fragment>
          )}

          {command === "guild" && (
            <Fragment>
              <Controller
                control={control}
                name="guild"
                render={({ field }) => (
                  <Input
                    {...field}
                    className="w-full md:flex-1"
                    label="Guild"
                    labelPlacement="inside"
                  />
                )}
              />
              <div className="flex items-center justify-center">
                <span className="text-3xl font-bold text-default-500">@</span>
              </div>
              <Autocomplete
                allowsCustomValue
                className="w-full md:flex-1 heroui-select-fix"
                defaultSelectedKey={selectedRealm}
                label="Realm"
                labelPlacement="inside"
                onInputChange={(value) => {
                  if (value) setSelectedRealm(value);
                }}
                onSelectionChange={(key) => {
                  if (key) setSelectedRealm(key as string);
                }}
              >
                {REALMS.map((option) => (
                  <AutocompleteItem key={option.value}>
                    {option.label}
                  </AutocompleteItem>
                ))}
              </Autocomplete>
            </Fragment>
          )}

          {command === "hash" && (
            <Fragment>
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <div className="w-full md:w-32">
                    <Select
                      {...field}
                      className="w-full heroui-select-fix"
                      classNames={{
                        trigger: "min-h-[56px] h-[56px]",
                      }}
                      label="Type"
                      labelPlacement="inside"
                      selectedKeys={field.value ? [field.value] : []}
                      variant="flat"
                      onSelectionChange={(keys) => {
                        const value = Array.from(keys)[0] as string;

                        field.onChange(value);
                      }}
                    >
                      {HASH.map((option) => (
                        <SelectItem key={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                )}
              />
              <div className="flex items-center justify-center">
                <span className="text-3xl font-bold text-default-500">@</span>
              </div>
              <Controller
                control={control}
                name="hash"
                render={({ field }) => (
                  <Input
                    {...field}
                    className="w-full md:flex-1"
                    label="Hash"
                    labelPlacement="inside"
                  />
                )}
              />
            </Fragment>
          )}

          {command === "commodity" && (
            <Fragment>
              <Controller
                control={control}
                name="commodity"
                render={({ field }) => (
                  <Input
                    {...field}
                    className="w-full md:flex-1"
                    label="Commodity"
                    labelPlacement="inside"
                  />
                )}
              />
              <div className="flex items-center justify-center">
                <span className="text-3xl font-bold text-default-500">@</span>
              </div>
              <Autocomplete
                allowsCustomValue
                className="w-full md:flex-1 heroui-select-fix"
                defaultSelectedKey={selectedRealm}
                label="Realm"
                labelPlacement="inside"
                onInputChange={(value) => {
                  if (value) setSelectedRealm(value);
                }}
                onSelectionChange={(key) => {
                  if (key) setSelectedRealm(key as string);
                }}
              >
                {REALMS.map((option) => (
                  <AutocompleteItem key={option.value}>
                    {option.label}
                  </AutocompleteItem>
                ))}
              </Autocomplete>
            </Fragment>
          )}

          {command === "gold" && (
            <Fragment>
              <div className="flex items-center justify-center">
                <span className="text-3xl font-bold text-default-500">@</span>
              </div>
              <Autocomplete
                allowsCustomValue
                className="w-full md:flex-1"
                defaultSelectedKey={selectedRealm}
                label="Realm"
                labelPlacement="inside"
                onInputChange={(value) => {
                  if (value) setSelectedRealm(value);
                }}
                onSelectionChange={(key) => {
                  if (key) setSelectedRealm(key as string);
                }}
              >
                {REALMS.map((option) => (
                  <AutocompleteItem key={option.value}>
                    {option.label}
                  </AutocompleteItem>
                ))}
              </Autocomplete>
            </Fragment>
          )}

          <Button
            isIconOnly
            color="secondary"
            isLoading={isSubmitting}
            size="lg"
            type="submit"
          >
            →
          </Button>
        </div>
      </div>
    </form>
  );
};
