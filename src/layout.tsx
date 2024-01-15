import {
  Box,
  Flex,
  Heading,
  Image,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { PropsWithChildren, useEffect, useState } from "react";
import { Branding } from "./components/branding/branding";

import Container from "./components/container";
import Player from "./components/player";
import Side from "./components/side";
import useData from "./hooks/useData";
import useMobile from "./hooks/useMobile";
import usePlayer from "./hooks/usePlayer";
import Midi from "./interfaces/midi";
import SoundFont from "./interfaces/soundfont";
import { getCDNPathOrNull } from "./utils/constants.utils";

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
  const icon = getCDNPathOrNull(value.icon);

  return (
    <Flex
      alignItems={"center"}
      marginBottom={"10px"}
      cursor={"pointer"}
      onClick={onClick}
    >
      {icon != null && (
        <Image
          src={icon}
          mr={"4px"}
          height={"100%"}
          width={"100%"}
          maxWidth={"50px"}
        />
      )}

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
  const player = usePlayer();
  const { soundfonts } = useData();

  return (
    <GenericModal isOpen={isOpen} onClose={onClose} title={"Select SoundFont"}>
      <ModalSelectItem
        value={{
          author: "Click here to upload a .sf2 file",
          name: "Upload a Soundfont",
          url: "",
        }}
        onClick={async () => {
          const input = document.createElement("input");
          input.type = "file";
          input.accept = ".sf2";
          input.onchange = async (_) => {
            const file = input.files ? input.files[0] : null;
            if (file) {
              await player.loadSoundFont(file);
            }
            input.remove();
            onClose();
          };
          input.click();
        }}
      />

      <hr style={{ marginBottom: "20px" }} />

      {soundfonts.map((soundfont, index) => (
        <ModalSelectItem
          value={soundfont}
          key={index}
          onClick={async () => {
            await player.loadSoundFont(soundfont);
            onClose();
          }}
        />
      ))}
    </GenericModal>
  );
}

function MidiModal({ isOpen, onClose }: ModalProps) {
  const player = usePlayer();
  const { midis } = useData();

  return (
    <GenericModal isOpen={isOpen} onClose={onClose} title={"Select Midi"}>
      <ModalSelectItem
        value={{
          author: "Click here to upload a .mid or .midi file",
          name: "Upload a file",
          url: "",
        }}
        onClick={async () => {
          const input = document.createElement("input");
          input.type = "file";
          input.accept = ".mid,.midi";
          input.onchange = async (_) => {
            const file = input.files ? input.files[0] : null;
            if (file) {
              await player.loadMidi(file);
            }
            input.remove();
            onClose();
          };
          input.click();
        }}
      />

      <hr style={{ marginBottom: "20px" }} />

      {midis.map((midi, index) => (
        <ModalSelectItem
          value={midi}
          key={index}
          onClick={async () => {
            await player.loadMidi(midi);
            onClose();
          }}
        />
      ))}
    </GenericModal>
  );
}

export default function Layout() {
  const isMobile = useMobile();
  const fontModal = useDisclosure();
  const midiModal = useDisclosure();
  const player = usePlayer();
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
    <>
      <FontModal isOpen={fontModal.isOpen} onClose={fontModal.onClose} />
      <MidiModal isOpen={midiModal.isOpen} onClose={midiModal.onClose} />

      <Container>
        {/* Branding and Player */}
        <Flex flexDir={"column"} alignItems={"center"} gap={"20px"}>
          <Branding />

          {isMobile && <Player />}
        </Flex>

        {/* Selector */}
        <Flex alignItems={"center"} justifyContent={"center"}>
          <Side onClick={fontModal.onOpen}>
            {player.soundFont != null && (
              <Image
                alt={"SoundFont Cover"}
                width={"100%"}
                height={"100%"}
                maxWidth={isMobile ? "150px" : "300px"}
                maxHeight={isMobile ? "150px" : "300px"}
                src={
                  getCDNPathOrNull(player.soundFont?.icon) ||
                  "/default_sf_cover.png"
                }
              />
            )}

            <Heading>
              {player.soundFont ? player.soundFont.name : "NO SELECTED FONT"}
            </Heading>
            <Text>Click to explore or upload</Text>
          </Side>

          {!isMobile && (
            <Side vAlign="center">
              <Player />
            </Side>
          )}

          <Side onClick={midiModal.onOpen}>
            {player.midi != null && (
              <Image
                alt={"Midi Cover"}
                width={"100%"}
                height={"100%"}
                maxWidth={isMobile ? "150px" : "300px"}
                maxHeight={isMobile ? "150px" : "300px"}
                src={
                  getCDNPathOrNull(player.midi?.midi.icon) ||
                  "/default_midi_cover.png"
                }
              />
            )}

            <Heading>
              {player.midi ? player.midi.midi.name : "NO SELECTED MIDI"}
            </Heading>
            <Text>Click to explore or upload</Text>
          </Side>
        </Flex>

        {/* Footer */}
        <Flex
          justifyContent={"center"}
          gap={"20px"}
          textDecoration={"underline"}
          letterSpacing={"2px"}
        >
          <Link href={"https://ko-fi.com/sammwy"} isExternal>
            Donate
          </Link>
          <Link href={"https://github.com/sammwyy/catsynth"} isExternal>
            GitHub
          </Link>
        </Flex>
      </Container>
    </>
  );
}
