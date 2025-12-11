"use client";

import { useRouter } from "next/navigation";
import { Fragment, useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import {
  Select,
  SelectItem,
  Autocomplete,
  AutocompleteItem,
} from "@heroui/react";
import { debounce } from "lodash";

import { COMMANDS, REALMS, HASH } from "@/constants";

type SearchFormValues = {
  command: string;
  character: string;
  guild: string;
  type: string;
  commodity: string;
  hash: string;
};

type CommodityItem = {
  id: number;
  name: string;
  quality?: number;
};

export const SearchForm = () => {
  const router = useRouter();
  const [selectedRealm, setSelectedRealm] = useState(REALMS[0].value);
  const [commodityItems, setCommodityItems] = useState<CommodityItem[]>([]);
  const [commodityLoading, setCommodityLoading] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
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

  const fetchCommodityItems = useCallback(
    debounce(async (query: string) => {
      if (!query || query.length < 1) {
        setCommodityItems([]);

        return;
      }

      setCommodityLoading(true);
      try {
        const response = await fetch(
          `/api/dma/item/search?q=${encodeURIComponent(query)}&limit=25`
        );

        if (response.ok) {
          const data = await response.json();

          setCommodityItems(data.results || []);
        }
      } catch (error) {
        console.error("Error fetching commodity items:", error);
        setCommodityItems([]);
      } finally {
        setCommodityLoading(false);
      }
    }, 300),
    []
  );

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
        // Commodity uses only item ID (no realm)
        route = `/item/${values.commodity}`;
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
            <Controller
              control={control}
              name="commodity"
              render={({ field }) => (
                <Autocomplete
                  allowsCustomValue
                  className="w-full md:flex-1 heroui-select-fix"
                  inputValue={field.value}
                  isLoading={commodityLoading}
                  items={commodityItems}
                  label="Commodity"
                  labelPlacement="inside"
                  placeholder="Search by item ID or name"
                  onInputChange={(value) => {
                    fetchCommodityItems(value);
                  }}
                  onSelectionChange={(key) => {
                    if (key) {
                      field.onChange(key.toString());
                    }
                  }}
                >
                  {(item) => (
                    <AutocompleteItem
                      key={item.id.toString()}
                      textValue={item.name}
                    >
                      <div className="flex flex-col">
                        <span className="text-small">{item.name}</span>
                        <span className="text-tiny text-default-400">
                          ID: {item.id}
                        </span>
                      </div>
                    </AutocompleteItem>
                  )}
                </Autocomplete>
              )}
            />
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
