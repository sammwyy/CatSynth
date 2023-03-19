import {
  Box,
  Heading,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  ModalFooter,
  Flex,
  Image,
} from "@chakra-ui/react";
import { PropsWithChildren, useEffect, useState } from "react";

import soundfonts, { SoundFont } from "./data/soundfonts";
import midis, { Midi } from "./data/midis";

import Cat from "./components/cat";
import Container from "./components/container";
import Player from "./components/player";
import Side from "./components/side";
import usePlayer from "./hooks/usePlayer";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface GenericModalProps extends ModalProps, PropsWithChildren {
  title: string;
}

function GenericModal({ isOpen, onClose, title, children }: GenericModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody overflowY={"scroll"} maxHeight={"400px"}>
          {children}
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
}

interface ModalSelectItemProps {
  value: SoundFont | Midi;
  onClick: () => void;
}

function ModalSelectItem({ value, onClick }: ModalSelectItemProps) {
  const asMidi = value as Midi;

  return (
    <Flex
      alignItems={"center"}
      marginBottom={"10px"}
      cursor={"pointer"}
      onClick={onClick}
    >
      <Image src={value.icon} mr={"4px"} />
      <Box>
        <Text fontSize={"18px"} fontWeight={"bold"} color={"white"}>
          {value.name}
        </Text>
        <Text fontSize={"14px"} color={"#aaa"}>
          {asMidi.author || "Unknown"}
        </Text>
      </Box>
    </Flex>
  );
}

function FontModal({ isOpen, onClose }: ModalProps) {
  const { player } = usePlayer();

  return (
    <GenericModal isOpen={isOpen} onClose={onClose} title={"Select SoundFont"}>
      {soundfonts.map((soundfont, index) => (
        <ModalSelectItem
          value={soundfont}
          key={index}
          onClick={async () => {
            await player.loadSoundfontURL(soundfont);
            onClose();
          }}
        />
      ))}
    </GenericModal>
  );
}

function MidiModal({ isOpen, onClose }: ModalProps) {
  const { player } = usePlayer();

  return (
    <GenericModal isOpen={isOpen} onClose={onClose} title={"Select Midi"}>
      <ModalSelectItem
        value={{
          author: "Local",
          name: "Upload a file",
          url: "",
        }}
        onClick={async () => {
          const input = document.createElement("input");
          input.type = "file";
          input.onchange = async (_) => {
            const file = input.files ? input.files[0] : null;
            if (file) {
              await player.loadMidiFile(file);
            }
            input.remove();
            onClose();
          };
          input.click();
        }}
      />

      {midis.map((midi, index) => (
        <ModalSelectItem
          value={midi}
          key={index}
          onClick={async () => {
            await player.loadMidiURL(midi);
            onClose();
          }}
        />
      ))}
    </GenericModal>
  );
}

export default function Layout() {
  const fontModal = useDisclosure();
  const midiModal = useDisclosure();
  const { player } = usePlayer();
  const [auxUpdate, setAuxUpdate] = useState(0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function forceUpdate() {
    setAuxUpdate(auxUpdate + 1);
  }

  useEffect(() => {
    if (!midiModal.isOpen && !fontModal.isOpen) {
      forceUpdate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [midiModal.isOpen, fontModal.isOpen]);

  return (
    <Container>
      <Side onClick={fontModal.onOpen}>
        <Box textAlign={"center"}>
          <Heading>
            {player.isFontLoaded()
              ? player.getSoundFont()?.name
              : "NO SELECTED FONT"}
          </Heading>
          <Text>Click to explore or upload</Text>
        </Box>
      </Side>

      <Player />
      <Cat />

      <FontModal isOpen={fontModal.isOpen} onClose={fontModal.onClose} />
      <MidiModal isOpen={midiModal.isOpen} onClose={midiModal.onClose} />

      <Side onClick={midiModal.onOpen}>
        <Box textAlign={"center"}>
          <Heading>
            {player.isSongLoaded()
              ? player.getMidi()?.name
              : "NO SELECTED MIDI"}
          </Heading>
          <Text>Click to explore or upload</Text>
        </Box>
      </Side>
    </Container>
  );
}
